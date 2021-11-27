import * as BB from "@talent/parser-bitbuffer";
import type { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { stream } from "@talent/parser/lib/Stream";
import { pipe } from "fp-ts/lib/function";
import { readDelta } from "../../../delta";

export type Event = unknown;

export const event: B.BufferParser<Event> = (i) =>
  pipe(
    stream(i.buffer, i.cursor * 8),

    pipe(
      BB.ubits(5),
      P.chain((entityCount) =>
        pipe(
          P.struct({ index: BB.ubits(10) }),

          P.chain((entity) =>
            pipe(
              BB.ubits(1),
              P.filter((hasPacketIndex) => hasPacketIndex !== 0),
              P.apSecond(
                pipe(
                  BB.ubits(11),
                  P.chain((packetIndex) =>
                    pipe(
                      BB.ubits(1),
                      P.filter((hasDelta) => hasDelta !== 0),
                      P.apSecond(readDelta("event_t")),
                      P.map((delta) => ({ packetIndex, delta })),
                      P.alt(() => P.of({ packetIndex }))
                    )
                  )
                )
              ),
              P.map((packet) => ({ ...entity, ...packet })),
              P.alt(() => P.of(entity))
            )
          ),

          P.chain((entity) =>
            pipe(
              BB.ubits(1),
              P.filter((hasFireTime) => hasFireTime !== 0),
              P.apSecond(BB.ubits(16)),
              P.map((fireTime) => ({ ...entity, fireTime })),
              P.alt(() => P.of(entity))
            )
          ),

          (fa) => P.struct({ events: P.manyN(fa, entityCount) }),

          BB.nextByte
        )
      )
    )
  );
