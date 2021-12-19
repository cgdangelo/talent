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

const packetIndex: B.BufferParser<Event["events"][number]["packetIndex"]> =
  pipe(
    BB.ubits(1),
    P.chain((hasPacketIndex) =>
      hasPacketIndex !== 0 ? BB.ubits(11) : P.of(undefined)
    )
  );

const delta: B.BufferParser<Event["events"][number]["delta"]> = pipe(
  BB.ubits(1),
  P.chain((hasDelta) =>
    hasDelta !== 0 ? readDelta("event_t") : P.of(undefined)
  )
);

const fireTime: B.BufferParser<Event["events"][number]["fireTime"]> = pipe(
  BB.ubits(1),
  P.chain((hasFireTime) => (hasFireTime !== 0 ? BB.ubits(16) : P.of(undefined)))
);

const events: (eventCount: number) => B.BufferParser<Event["events"]> = (
  eventCount
) =>
  pipe(
    P.struct({ eventIndex: BB.ubits(1), packetIndex }),

    P.bind("delta", ({ packetIndex }) =>
      packetIndex != null ? delta : P.of(undefined)
    ),

    P.bind("fireTime", () => fireTime),

    (event) => P.manyN(event, eventCount)
  );

export const event: B.BufferParser<Event> = (i) =>
  pipe(
    stream(i.buffer, i.cursor * 8),

    pipe(BB.ubits(5), P.chain(events), P.bindTo("events"), BB.nextByte)
  );
