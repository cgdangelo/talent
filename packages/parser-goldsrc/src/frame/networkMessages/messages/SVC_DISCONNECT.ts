import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";
import { MessageType } from "../MessageType";

export type Disconnect = {
  readonly type: {
    readonly id: MessageType.SVC_DISCONNECT;
    readonly name: "SVC_DISCONNECT";
  };

  readonly fields: {
    readonly reason: string;
  };
};

export const disconnect: B.BufferParser<Disconnect> = pipe(
  P.struct({ reason: B.ztstr }),

  P.map((fields) => ({
    type: { id: MessageType.SVC_DISCONNECT, name: "SVC_DISCONNECT" } as const,
    fields,
  }))
);
