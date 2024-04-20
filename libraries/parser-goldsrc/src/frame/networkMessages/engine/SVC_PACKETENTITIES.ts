import { parser as P, statefulParser as SP } from '@cgdangelo/talent-parser';
import * as BB from '@cgdangelo/talent-parser-bitbuffer';
import { type buffer as B } from '@cgdangelo/talent-parser-buffer';
import { success } from '@cgdangelo/talent-parser/lib/ParseResult';
import { stream } from '@cgdangelo/talent-parser/lib/Stream';
import { pipe } from 'fp-ts/lib/function';
import { type Delta } from '../../../delta';
import { readDelta } from '../../../delta';
import * as DS from '../../../DemoState';
import { MessageType } from '../MessageType';

type PacketEntity = {
  readonly entityIndex: number;
  readonly baselineIndex?: number;
  readonly entityState: Delta;
};

export type PacketEntities = {
  readonly id: MessageType.SVC_PACKETENTITIES;
  readonly name: 'SVC_PACKETENTITIES';

  readonly fields: {
    readonly entityCount: number;
    readonly entityStates: readonly PacketEntity[];
  };
};

const entityState: (entityIndex: number) => DS.DemoStateParser<PacketEntity> = (entityIndex) =>
  pipe(
    DS.lift(BB.ubits(1)),
    SP.bindTo('hasCustomDelta'),
    SP.bind('baselineIndex', () => SP.lift(BB.bitFlagged(() => BB.ubits(6)))),
    SP.chain(({ hasCustomDelta, baselineIndex }) =>
      pipe(
        DS.get(),
        SP.chain(({ maxClients }) =>
          pipe(
            readDelta(
              entityIndex > 0 && entityIndex <= maxClients
                ? 'entity_state_player_t'
                : hasCustomDelta !== 0
                ? 'custom_entity_state_t'
                : 'entity_state_t'
            ),
            SP.map((entityState) => ({
              entityIndex,
              baselineIndex,
              entityState
            }))
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
    P.chain((incrementEntityIndex) =>
      incrementEntityIndex !== 0
        ? P.of(1)
        : pipe(
            BB.ubits(1),
            P.chain((absoluteEntityIndex) =>
              absoluteEntityIndex !== 0
                ? pipe(
                    BB.ubits(11),
                    P.map((nextEntityIndex) => nextEntityIndex - currentEntityIndex)
                  )
                : BB.ubits(6)
            )
          )
    ),

    P.map((entityIndexDiff) => (currentEntityIndex += entityIndexDiff))
  );
};

const entityStates: () => DS.DemoStateParser<PacketEntities['fields']['entityStates']> = () =>
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

          // Parse entity index
          P.apSecond(nextEntityIndex())
        )
      ),

      // Parse entity with the given index
      SP.chain(entityState)
    )
  );

// TODO Refactor this + SVC_DELTAPACKETENTITIES
export const packetEntities: DS.DemoStateParser<PacketEntities> = (s) => (i) =>
  pipe(
    stream(i.buffer, i.cursor * 8),

    pipe(
      DS.lift(BB.ubits(16)),

      SP.bindTo('entityCount'),

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
          id: MessageType.SVC_PACKETENTITIES,
          name: 'SVC_PACKETENTITIES',
          fields
        } as const;
      })
    )(s)
  );
