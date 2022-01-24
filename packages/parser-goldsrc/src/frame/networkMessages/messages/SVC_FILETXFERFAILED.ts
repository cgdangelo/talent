import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";
import { MessageType } from "../MessageType";

export type FileTxferFailed = {
  readonly id: MessageType.SVC_FILETXFERFAILED;
  readonly name: "SVC_FILETXFERFAILED";

  readonly fields: {
    readonly filename: string;
  };
};

export const fileTxferFailed: B.BufferParser<FileTxferFailed> = pipe(
  P.struct({ filename: B.ztstr }),

  P.map((fields) => ({
    id: MessageType.SVC_FILETXFERFAILED,
    name: "SVC_FILETXFERFAILED",
    fields,
  }))
);
