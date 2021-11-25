import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";

export type Time = {
  readonly time: number;
};

export const time: B.BufferParser<Time> = P.struct({
  time: B.float32_le,
});
