import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";
import { MessageType } from "../MessageType";

export type Time = {
  readonly id: MessageType.SVC_TIME;
  readonly name: "SVC_TIME";

  readonly fields: {
    readonly time: number;
  };
};

export const time: B.BufferParser<Time> = pipe(
  P.struct({ time: B.float32_le }),

  P.map((fields) => ({
    id: MessageType.SVC_TIME,
    name: "SVC_TIME",
    fields,
  }))
);
