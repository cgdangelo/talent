import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";
import { MessageType } from "../MessageType";

export type SendCvarValue2 = {
  readonly type: {
    readonly id: MessageType.SVC_SENDCVARVALUE2;
    readonly name: "SVC_SENDCVARVALUE2";
  };

  readonly fields: {
    readonly requestId: number;
    readonly name: string;
  };
};

export const sendCvarValue2: B.BufferParser<SendCvarValue2> = pipe(
  P.struct({ requestId: B.uint32_le, name: B.ztstr }),

  P.map((fields) => ({
    type: {
      id: MessageType.SVC_SENDCVARVALUE2,
      name: "SVC_SENDCVARVALUE2",
    } as const,
    fields,
  }))
);
