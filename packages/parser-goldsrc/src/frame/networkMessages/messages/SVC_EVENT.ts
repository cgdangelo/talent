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
    P.struct({
      eventIndex: BB.ubits(10),
      packetIndex: BB.bitFlagged(() => BB.ubits(11)),
    }),

    P.bind("delta", ({ packetIndex }) =>
      packetIndex != null
        ? BB.bitFlagged(() => readDelta("event_t"))
        : P.of(undefined)
    ),

    P.bind("fireTime", () => BB.bitFlagged(() => BB.ubits(16))),

    (event) => P.manyN(event, eventCount)
  );

export const event: B.BufferParser<Event> = (i) =>
  pipe(
    stream(i.buffer, i.cursor * 8),

    pipe(BB.ubits(5), P.chain(events), P.bindTo("events"), BB.nextByte)
  );
