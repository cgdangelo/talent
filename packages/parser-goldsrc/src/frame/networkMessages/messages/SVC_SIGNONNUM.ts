import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";

export type SignOnNum = {
  readonly sign: number;
};

export const signOnNum: B.BufferParser<SignOnNum> = P.struct({
  sign: B.int8_le,
});
