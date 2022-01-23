import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";
import { MessageType } from "../MessageType";

export type TimeScale = {
  readonly type: {
    readonly id: MessageType.SVC_TIMESCALE;
    readonly name: "SVC_TIMESCALE";
  };

  readonly fields: {
    readonly timeScale: number;
  };
};

export const timeScale: B.BufferParser<TimeScale> = pipe(
  P.struct({ timeScale: B.float32_le }),

  P.map((fields) => ({
    type: { id: MessageType.SVC_TIMESCALE, name: "SVC_TIMESCALE" } as const,
    fields,
  }))
);
