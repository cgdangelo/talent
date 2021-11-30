import * as BB from "@talent/parser-bitbuffer";
import type { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { stream } from "@talent/parser/lib/Stream";
import { pipe } from "fp-ts/lib/function";
import type { Delta } from "../../../delta";
import { readDelta } from "../../../delta";

type PacketEntity = {
  readonly entityIndex: number;
  readonly baselineIndex?: number;
  readonly entityState: Delta;
};

export type PacketEntities = {
  readonly entityCount: number;
  readonly entityStates: readonly PacketEntity[];
};

const entityStates: B.BufferParser<PacketEntities["entityStates"]> = (() => {
  let entityIndex = 0;

  return pipe(
    P.many(
      pipe(
        BB.ubits(16),
        P.filter((footer) => footer !== 0),
        P.apSecond(P.skip(-16)),

        P.apSecond(
          pipe(
            BB.ubits(1),

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
                              (nextEntityIndex) => nextEntityIndex - entityIndex
                            )
                          )
                        : BB.ubits(6)
                    )
                  )
            ),
            P.map((entityIndexDiff) => (entityIndex += entityIndexDiff))
          )
        ),

        P.apSecond(
          pipe(
            P.struct({
              hasCustomDelta: BB.ubits(1),
              baselineIndex: pipe(
                BB.ubits(1),
                P.chain((hasBaselineIndex) =>
                  hasBaselineIndex !== 0
                    ? BB.ubits(6)
                    : P.of<number, number | undefined>(undefined)
                )
              ),
            })
          )
        ),

        P.chain(({ hasCustomDelta, baselineIndex }) =>
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
              baselineIndex,
              entityState,
            }))
          )
        )
      )
    ),

    P.apFirst(P.skip(16))
  );
})();

// TODO Refactor this + SVC_DELTAPACKETENTITIES
export const packetEntities: B.BufferParser<PacketEntities> = (i) =>
  pipe(
    stream(i.buffer, i.cursor * 8),

    pipe(
      P.struct({
        entityCount: BB.ubits(16),
        entityStates,
      }),
      BB.nextByte
    )
  );
