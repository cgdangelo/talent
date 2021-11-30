import * as BB from "@talent/parser-bitbuffer";
import type { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { stream } from "@talent/parser/lib/Stream";
import { pipe } from "fp-ts/lib/function";
import type { Delta } from "../../../delta";
import { readDelta } from "../../../delta";

type DeltaPacketEntity = {
  readonly entityIndex: number;
  readonly entityState: Delta | null;
};

export type DeltaPacketEntities = {
  readonly entityCount: number;
  readonly entityStates: readonly DeltaPacketEntity[];
};

const entityState: (entityIndex: number) => B.BufferParser<DeltaPacketEntity> =
  (entityIndex) =>
    pipe(
      BB.ubits(1),

      P.chain((hasCustomDelta) =>
        pipe(
          readDelta(
            entityIndex > 0 && entityIndex < 33
              ? "entity_state_player_t"
              : hasCustomDelta !== 0
              ? "custom_entity_state_t"
              : "entity_state_t"
          ),

          P.map((entityState) => ({
            entityIndex,
            entityState,
          }))
        )
      )
    );

const nextEntityIndex: () => B.BufferParser<number> = () => {
  let currentEntityIndex = 0;

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
                    P.map(
                      (nextEntityIndex) => nextEntityIndex - currentEntityIndex
                    )
                  )
                : BB.ubits(6)
            )
          )
    ),

    P.map((entityIndexDiff) => (currentEntityIndex += entityIndexDiff))
  );
};

const entityStates: () => B.BufferParser<DeltaPacketEntities["entityStates"]> =
  () =>
    pipe(
      P.many(
        pipe(
          BB.ubits(16),
          P.filter((footer) => footer !== 0),
          P.apSecond(P.skip(-16)),

          P.apSecond(
            P.struct({
              removeEntity: BB.ubits(1),
              entityIndex: nextEntityIndex(),
            })
          ),

          P.chain(({ removeEntity, entityIndex }) =>
            removeEntity !== 0
              ? entityState(entityIndex)
              : P.of({
                  entityIndex,
                  entityState: null,
                })
          )
        )
      )
    );

export const deltaPacketEntities: B.BufferParser<DeltaPacketEntities> = (i) =>
  pipe(
    stream(i.buffer, i.cursor * 8),

    pipe(
      P.struct({
        entityCount: BB.ubits(16),
        deltaUpdateMask: BB.ubits(8),
        entityStates: entityStates(),
      }),

      P.apFirst(P.skip(16)),
      BB.nextByte
    )
  );
