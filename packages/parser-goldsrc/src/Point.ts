import type { BufferParser } from "@talent/parser-buffer/lib/buffer";
import { float32_le } from "@talent/parser-buffer/lib/buffer";
import * as P from "@talent/parser/lib/Parser";
import { sequenceS } from "fp-ts/lib/Apply";

export type Point = {
  readonly x: number;
  readonly y: number;
  readonly z: number;
};

export const point: BufferParser<Point> = sequenceS(P.Applicative)({
  x: float32_le,
  y: float32_le,
  z: float32_le,
});
