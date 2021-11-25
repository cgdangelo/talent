import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";

export type CenterPrint = {
  readonly message: string;
};

export const centerPrint: B.BufferParser<CenterPrint> = P.struct({
  message: B.ztstr,
});
