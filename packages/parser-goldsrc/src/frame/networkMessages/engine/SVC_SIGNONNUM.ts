import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";
import { MessageType } from "../MessageType";

export type SignOnNum = {
  readonly id: MessageType.SVC_SIGNONNUM;
  readonly name: "SVC_SIGNONNUM";

  readonly fields: {
    readonly sign: number;
  };
};

export const signOnNum: B.BufferParser<SignOnNum> = pipe(
  P.struct({ sign: B.int8_le }),

  P.map((fields) => ({
    id: MessageType.SVC_SIGNONNUM,
    name: "SVC_SIGNONNUM",
    fields,
  }))
);
