import { parser as P, statefulParser as SP } from "@talent/parser";
import * as BB from "@talent/parser-bitbuffer";
import type { buffer as B } from "@talent/parser-buffer";
import { success } from "@talent/parser/lib/ParseResult";
import { stream } from "@talent/parser/lib/Stream";
import { pipe } from "fp-ts/lib/function";
import type { Delta } from "../../../delta";
import { readDelta } from "../../../delta";
import type { DemoState, DemoStateParser } from "../../../DemoState";

type PacketEntity = {
  readonly entityIndex: number;
  readonly baselineIndex?: number;
  readonly entityState: Delta;
};

export type PacketEntities = {
  readonly entityCount: number;
  readonly entityStates: readonly PacketEntity[];
};

const entityState: (entityIndex: number) => DemoStateParser<PacketEntity> = (
  entityIndex
) =>
  pipe(
    SP.lift<number, number, DemoState>(BB.ubits(1)),
    SP.bindTo("hasCustomDelta"),
    SP.bind("baselineIndex", () => SP.lift(BB.bitFlagged(() => BB.ubits(6)))),
    SP.chain(({ hasCustomDelta, baselineIndex }) =>
      pipe(
        readDelta(
          entityIndex > 0 && entityIndex < 33
            ? "entity_state_player_t"
            : hasCustomDelta !== 0
            ? "custom_entity_state_t"
            : "entity_state_t"
        ),

        SP.map((entityState) => ({
          entityIndex,
          baselineIndex,
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

const entityStates: () => DemoStateParser<PacketEntities["entityStates"]> =
  () =>
    SP.many(
      pipe(
        SP.lift<number, number, DemoState>(
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
export const packetEntities: DemoStateParser<PacketEntities> = (s) => (i) =>
  pipe(
    stream(i.buffer, i.cursor * 8),

    pipe(
      SP.lift<number, number, DemoState>(BB.ubits(16)),
      SP.bindTo("entityCount"),
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
