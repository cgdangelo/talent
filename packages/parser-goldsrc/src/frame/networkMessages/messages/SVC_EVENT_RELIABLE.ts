import * as BB from "@talent/parser-bitbuffer";
import type { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { stream } from "@talent/parser/lib/Stream";
import { pipe } from "fp-ts/lib/function";
import type { Delta } from "../../../delta";
import { readDelta } from "../../../delta";

export type EventReliable = {
  readonly eventIndex: number;
  readonly eventArgs: Delta;
  readonly fireTime?: number;
};

export const eventReliable: B.BufferParser<EventReliable> = (i) =>
  pipe(
    stream(i.buffer, i.cursor * 8),

    pipe(
      P.struct({
        eventIndex: BB.ubits(10),
        eventArgs: readDelta("event_args_t"),
        fireTime: BB.bitFlagged(() => BB.ubits(16)),
      }),
      BB.nextByte
    )
  );
