import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";

export type StuffText = {
  readonly command: string;
};

export const stuffText: B.BufferParser<StuffText> = P.struct({
  command: B.ztstr,
});
