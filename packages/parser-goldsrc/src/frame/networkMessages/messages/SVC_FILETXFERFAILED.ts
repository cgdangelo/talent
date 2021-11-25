import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";

export type FileTxferFailed = {
  readonly filename: string;
};

export const fileTxferFailed: B.BufferParser<FileTxferFailed> = P.struct({
  filename: B.ztstr,
});
