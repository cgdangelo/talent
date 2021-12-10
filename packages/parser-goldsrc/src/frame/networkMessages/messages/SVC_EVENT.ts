import * as BB from "@talent/parser-bitbuffer";
import type { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { stream } from "@talent/parser/lib/Stream";
import { pipe } from "fp-ts/lib/function";
import type { Delta } from "../../../delta";
import { readDelta } from "../../../delta";

export type Event = {
  readonly events: readonly {
    readonly eventIndex: number;
    readonly packetIndex?: number;
    readonly delta?: Delta;
    readonly fireTime?: number;
  }[];
};

const events: (eventCount: number) => B.BufferParser<Event["events"]> = (
  eventCount
) =>
  pipe(
    P.struct({ eventIndex: BB.ubits(10) }),

    P.chain((event) =>
      pipe(
        BB.ubits(1),
        P.chain((hasPacketIndex) =>
          hasPacketIndex !== 0
            ? pipe(
                BB.ubits(11),
                P.chain((packetIndex) =>
                  pipe(
                    BB.ubits(1),
                    P.chain((hasDelta) =>
                      hasDelta !== 0 ? readDelta("event_t") : P.of(undefined)
                    ),
                    P.map((delta) => ({ packetIndex, delta }))
                  )
                )
              )
            : P.of({})
        ),
        P.map((a) => ({ ...event, ...a }))
      )
    ),

    P.chain((event) =>
      pipe(
        BB.ubits(1),
        P.chain((hasFireTime) =>
          hasFireTime !== 0
            ? pipe(
                BB.ubits(16),
                P.map((fireTime) => ({ fireTime }))
              )
            : P.of({})
        ),
        P.map((a) => ({ ...event, ...a }))
      )
    ),

    (fa) => P.manyN(fa, eventCount)
  );

export const event: B.BufferParser<Event> = (i) =>
  pipe(
    stream(i.buffer, i.cursor * 8),

    pipe(
      BB.ubits(5),
      P.chain(events),
      P.map((events) => ({ events })),
      BB.nextByte
    )
  );
