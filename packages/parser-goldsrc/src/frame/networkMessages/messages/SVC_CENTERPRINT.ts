import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";
import { MessageType } from "../MessageType";

export type CenterPrint = {
  readonly type: {
    readonly id: MessageType.SVC_CENTERPRINT;
    readonly name: "SVC_CENTERPRINT";
  };

  readonly fields: {
    readonly message: string;
  };
};

export const centerPrint: B.BufferParser<CenterPrint> = pipe(
  P.struct({ message: B.ztstr }),

  P.map((fields) => ({
    type: { id: MessageType.SVC_CENTERPRINT, name: "SVC_CENTERPRINT" } as const,
    fields,
  }))
);
