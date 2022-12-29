import { parser as P, statefulParser as SP } from '@talent/parser';
import * as BB from '@talent/parser-bitbuffer';
import type { buffer as B } from '@talent/parser-buffer';
import { success } from '@talent/parser/lib/ParseResult';
import { stream } from '@talent/parser/lib/Stream';
import { pipe } from 'fp-ts/lib/function';
import type { Delta } from '../../../delta';
import { readDelta } from '../../../delta';
import * as DS from '../../../DemoState';
import { MessageType } from '../MessageType';

type DeltaPacketEntity = {
  readonly entityIndex: number;
  readonly entityState?: Delta;
};

export type DeltaPacketEntities = {
  readonly id: MessageType.SVC_DELTAPACKETENTITIES;
  readonly name: 'SVC_DELTAPACKETENTITIES';

  readonly fields: {
    readonly entityCount: number;
    readonly deltaSequence: number;
    readonly entityStates: readonly DeltaPacketEntity[];
  };
};

const entityState: (entityIndex: number) => DS.DemoStateParser<DeltaPacketEntity> = (entityIndex) =>
  pipe(
    DS.lift(BB.ubits(1)),

    SP.chain((hasCustomDelta) =>
      pipe(
        SP.get<number, DS.DemoState>(),
        SP.chain(({ maxClients }) =>
          pipe(
            readDelta(
              entityIndex > 0 && entityIndex <= maxClients
                ? 'entity_state_player_t'
                : hasCustomDelta !== 0
                ? 'custom_entity_state_t'
                : 'entity_state_t'
            ),
            SP.map((entityState) => ({ entityIndex, entityState }))
          )
        )
      )
    )
  );

// HACK
let currentEntityIndex = 0;

const nextEntityIndex: () => B.BufferParser<number> = () => {
  return pipe(
    BB.ubits(1),

    // Calculate difference between current and next entity indices
    P.chain((absoluteEntityIndex) =>
      absoluteEntityIndex !== 0
        ? pipe(
            BB.ubits(11),
            P.map((nextEntityIndex) => nextEntityIndex - currentEntityIndex)
          )
        : BB.ubits(6)
    ),

    P.map((entityIndexDiff) => (currentEntityIndex += entityIndexDiff))
  );
};

const entityStates: () => DS.DemoStateParser<DeltaPacketEntities['fields']['entityStates']> = () =>
  SP.many(
    pipe(
      DS.lift(
        pipe(
          // Check footer before continuing
          P.lookAhead(
            pipe(
              BB.ubits(16),
              P.filter((footer) => footer !== 0)
            )
          ),

          P.chain(() =>
            P.struct({
              removeEntity: BB.ubits(1),
              entityIndex: nextEntityIndex()
            })
          )
        )
      ),

      // Parse entity with the given index
      SP.chain(({ removeEntity, entityIndex }) =>
        pipe(removeEntity !== 0 ? SP.of({ entityIndex }) : entityState(entityIndex))
      )
    )
  );

// TODO Refactor this + SVC_DELTAPACKETENTITIES
export const deltaPacketEntities: DS.DemoStateParser<DeltaPacketEntities> = (s) => (i) =>
  pipe(
    stream(i.buffer, i.cursor * 8),

    pipe(
      DS.lift(BB.ubits(16)),

      SP.bindTo('entityCount'),

      SP.bind('deltaSequence', () => SP.lift(BB.ubits(8))),

      SP.bind('entityStates', () => entityStates()),

      SP.chainFirst(() => SP.lift(P.skip(16))),

      SP.chain((a) =>
        SP.lift((o) =>
          success(a, i, stream(o.buffer, o.cursor % 8 === 0 ? o.cursor / 8 : Math.floor(o.cursor / 8) + 1))
        )
      ),

      SP.map((fields) => {
        currentEntityIndex = 0;

        return {
          id: MessageType.SVC_DELTAPACKETENTITIES,
          name: 'SVC_DELTAPACKETENTITIES',
          fields
        } as const;
      })
    )(s)
  );
