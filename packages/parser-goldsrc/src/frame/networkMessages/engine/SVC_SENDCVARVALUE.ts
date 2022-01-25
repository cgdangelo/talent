import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";
import { MessageType } from "../MessageType";

export type SendCvarValue = {
  readonly id: MessageType.SVC_SENDCVARVALUE;
  readonly name: "SVC_SENDCVARVALUE";

  readonly fields: {
    readonly name: string;
  };
};

// Deprecated
export const sendCvarValue: B.BufferParser<SendCvarValue> = pipe(
  P.struct({ name: B.ztstr }),

  P.map((fields) => ({
    id: MessageType.SVC_SENDCVARVALUE,
    name: "SVC_SENDCVARVALUE",
    fields,
  }))
);
