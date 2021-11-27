import * as BB from "@talent/parser-bitbuffer";
import type { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { success } from "@talent/parser/lib/ParseResult";
import { stream } from "@talent/parser/lib/Stream";
import { pipe } from "fp-ts/lib/function";
import type { Delta } from "../../../delta";
import { readDelta } from "../../../delta";

export type PacketEntities = {
  readonly entityIndex: number;
  readonly entityState: Delta;
}[];

// TODO Refactor this + SVC_DELTAPACKETENTITIES
export const packetEntities: B.BufferParser<PacketEntities> = (i) =>
  pipe(
    stream(i.buffer, i.cursor * 8),

    pipe(
      P.skip<number>(16),
      P.apSecond(
        P.many(
          (() => {
            let entityIndex = 0;

            return pipe(
              BB.bits(16),
              P.filter((footer) => footer !== 0),
              P.apSecond(
                P.struct({
                  removeEntity: BB.ubits(1),
                  absoluteEntityNumber: BB.ubits(1),
                })
              ),
              P.chainFirst((a) =>
                pipe(
                  BB.ubits(a.absoluteEntityNumber ? 11 : 6),
                  P.map(
                    (entIdx) =>
                      (entityIndex = a.absoluteEntityNumber
                        ? entIdx
                        : entityIndex + entIdx)
                  )
                )
              ),
              P.chain((a) =>
                a.removeEntity === 0 ? P.succeed(a) : P.fail<number>()
              ),

              P.apSecond(
                pipe(
                  BB.bits(1),
                  P.map((custom) =>
                    entityIndex > 0 && entityIndex < 33
                      ? "entity_state_player_t"
                      : custom !== 0
                      ? "custom_entity_state_t"
                      : "entity_state_t"
                  )
                )
              ),
              P.chain(readDelta),
              P.map((entityState) => ({ entityIndex, entityState })),
              P.apFirst(BB.nextByte),
              P.chain(
                (a) => (o) => success(a, i, stream(o.buffer, o.cursor / 8))
              )
            );
          })()
        )
      )
    )
  );
