import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "../Point";
import { point } from "../Point";

export type UserCmd = {
  readonly lerpMs: number;
  readonly ms: number;
  readonly viewAngles: Point;
  readonly forwardMove: number;
  readonly sideMove: number;
  readonly upMove: number;
  readonly lightLevel: number;
  readonly buttons: number;
  readonly impulse: number;
  readonly weaponSelect: number;
  readonly impactIndex: number;
  readonly impactPosition: Point;
};

export const userCmd: B.BufferParser<UserCmd> = P.struct({
  lerpMs: B.int16_le,
  ms: B.uint8_le,
  viewAngles: pipe(P.skip<number>(1), P.apSecond(point)),
  forwardMove: B.float32_le,
  sideMove: B.float32_le,
  upMove: B.float32_le,
  lightLevel: B.int8_le,
  buttons: pipe(P.skip<number>(1), P.apSecond(B.uint16_le)),
  impulse: B.int8_le,
  weaponSelect: B.int8_le,
  impactIndex: pipe(P.skip<number>(2), P.apSecond(B.int32_le)),
  impactPosition: point,
});
