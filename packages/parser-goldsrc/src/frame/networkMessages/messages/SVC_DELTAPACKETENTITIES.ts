import { parser as P, statefulParser as SP } from "@talent/parser";
import * as BB from "@talent/parser-bitbuffer";
import type { buffer as B } from "@talent/parser-buffer";
import { success } from "@talent/parser/lib/ParseResult";
import { stream } from "@talent/parser/lib/Stream";
import { pipe } from "fp-ts/lib/function";
import type { Delta } from "../../../delta";
import { readDelta } from "../../../delta";
import type { DemoState, DemoStateParser } from "../../../DemoState";

type DeltaPacketEntity = {
  readonly entityIndex: number;
  readonly entityState: Delta | null;
};

export type DeltaPacketEntities = {
  readonly entityCount: number;
  readonly deltaSequence: number;
  readonly entityStates: readonly DeltaPacketEntity[];
};

const entityState: (entityIndex: number) => DemoStateParser<DeltaPacketEntity> =
  (entityIndex) =>
    pipe(
      SP.lift<number, number, DemoState>(BB.ubits(1)),

      SP.chain((hasCustomDelta) =>
        pipe(
          readDelta(
            entityIndex > 0 && entityIndex < 33
              ? "entity_state_player_t"
              : hasCustomDelta !== 0
              ? "custom_entity_state_t"
              : "entity_state_t"
          ),

          SP.map((entityState) => ({ entityIndex, entityState }))
        )
      )
    );

const nextEntityIndex: () => B.BufferParser<number> = () => {
  let currentEntityIndex = 0;

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

const entityStates: () => DemoStateParser<DeltaPacketEntities["entityStates"]> =
  () =>
    SP.many(
      pipe(
        SP.lift<
          number,
          { removeEntity: number; entityIndex: number },
          DemoState
        >(
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
                entityIndex: nextEntityIndex(),
              })
            )
          )
        ),

        // Parse entity with the given index
        SP.chain(({ removeEntity, entityIndex }) =>
          pipe(
            removeEntity !== 0
              ? SP.of({ entityIndex, entityState: null })
              : entityState(entityIndex)
          )
        )
      )
    );

// TODO Refactor this + SVC_DELTAPACKETENTITIES
export const deltaPacketEntities: DemoStateParser<DeltaPacketEntities> =
  (s) => (i) =>
    pipe(
      stream(i.buffer, i.cursor * 8),

      pipe(
        SP.lift<number, number, DemoState>(BB.ubits(16)),
        SP.bindTo("entityCount"),
        SP.bind("deltaSequence", () => SP.lift(BB.ubits(8))),
        SP.bind("entityStates", () => entityStates()),
        SP.chainFirst(() => SP.lift(P.skip(16))),
        SP.chain((a) =>
          SP.lift((i) =>
            success(
              a,
              i,
              stream(
                i.buffer,
                i.cursor % 8 === 0 ? i.cursor / 8 : Math.floor(i.cursor / 8) + 1
              )
            )
          )
        )
      )(s)
    );
