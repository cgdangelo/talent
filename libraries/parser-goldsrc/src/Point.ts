import type { BufferParser } from "@talent/parser-buffer/lib/buffer";
import { float32_le } from "@talent/parser-buffer/lib/buffer";
import * as P from "@talent/parser/lib/Parser";

export type Point = {
  readonly x: number;
  readonly y: number;
  readonly z: number;
};

export const pointBy: <A extends number>(
  fa: BufferParser<A>
) => BufferParser<Point> = (fa) => P.struct({ x: fa, y: fa, z: fa });

export const point: BufferParser<Point> = pointBy(float32_le);
