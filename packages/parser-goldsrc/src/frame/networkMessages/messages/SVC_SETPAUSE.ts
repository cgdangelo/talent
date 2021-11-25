import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";

export type SetPause = {
  readonly isPaused: number;
};

export const setPause: B.BufferParser<SetPause> = P.struct({
  isPaused: B.int8_le,
});
