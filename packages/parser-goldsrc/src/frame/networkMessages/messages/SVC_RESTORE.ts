import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";

export type Restore = {
  readonly saveName: string;
  readonly mapCount: number;
  readonly mapNames: readonly string[];
};

export const restore: B.BufferParser<Restore> = pipe(
  P.struct({ saveName: B.ztstr, mapCount: B.uint8_le }),
  P.bind("mapNames", ({ mapCount }) => P.manyN(B.ztstr, mapCount))
);
