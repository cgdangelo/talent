import { statefulParser as SP } from "@talent/parser";
import * as BB from "@talent/parser-bitbuffer";
import { success } from "@talent/parser/lib/ParseResult";
import { stream } from "@talent/parser/lib/Stream";
import { pipe } from "fp-ts/lib/function";
import type { Delta } from "../../../delta";
import { readDelta } from "../../../delta";
import type { DemoState, DemoStateParser } from "../../../DemoState";

export type EventReliable = {
  readonly eventIndex: number;
  readonly eventArgs: Delta;
  readonly fireTime?: number;
};

const fireTime = BB.bitFlagged(() => BB.ubits(16));

export const eventReliable: DemoStateParser<EventReliable> = (s) => (i) =>
  pipe(
    stream(i.buffer, i.cursor * 8),

    pipe(
      SP.lift<number, number, DemoState>(BB.ubits(10)),
      SP.bindTo("eventIndex"),
      SP.bind("eventArgs", () => readDelta("event_args_t")),
      SP.bind("fireTime", () => SP.lift(fireTime)),

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
