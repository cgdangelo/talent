import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";

export type TimeScale = {
  readonly timeScale: number;
};

export const timeScale: B.BufferParser<TimeScale> = P.struct({
  timeScale: B.float32_le,
});
