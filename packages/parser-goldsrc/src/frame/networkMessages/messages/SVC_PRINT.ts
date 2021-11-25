import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";

export type Print = {
  readonly message: string;
};

export const print: B.BufferParser<Print> = P.struct({ message: B.ztstr });
