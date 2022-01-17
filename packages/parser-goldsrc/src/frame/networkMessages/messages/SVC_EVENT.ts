import { parser as P, statefulParser as SP } from "@talent/parser";
import * as BB from "@talent/parser-bitbuffer";
import { stream } from "@talent/parser/lib/Stream";
import { success } from "@talent/parser/lib/ParseResult";
import { pipe } from "fp-ts/lib/function";
import type { Delta } from "../../../delta";
import { readDelta } from "../../../delta";
import type { DemoState, DemoStateParser } from "../../../DemoState";

export type Event = {
  readonly events: readonly {
    readonly eventIndex: number;
    readonly packetIndex?: number;
    readonly delta?: Delta;
    readonly fireTime?: number;
  }[];
};

export const events: DemoStateParser<Event> = (s) => (i) =>
  pipe(
    stream(i.buffer, i.cursor * 8),

    pipe(
      SP.lift<number, number, DemoState>(BB.ubits(5)),
      SP.chain((eventCount) => SP.manyN(event, eventCount)),
      SP.bindTo("events")
    )(s)
  );

const event = pipe(
  SP.lift<number, { eventIndex: number; packetIndex?: number }, DemoState>(
    P.struct({
      eventIndex: BB.ubits(10),
      packetIndex: BB.bitFlagged(() => BB.ubits(11)),
    })
  ),

  SP.bind("delta", ({ packetIndex }) =>
    packetIndex != null
      ? pipe(
          SP.lift<number, number, DemoState>(BB.ubits(1)),
          SP.chain((hasDelta) =>
            hasDelta !== 0 ? readDelta("event_t") : SP.of(undefined)
          )
        )
      : SP.of(undefined)
  ),

  SP.bind("fireTime", () =>
    SP.lift<number, number | undefined, DemoState>(
      BB.bitFlagged(() => BB.ubits(16))
    )
  ),

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
);
