import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { sequenceS } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";
import type { Point} from "./Point";
import { point } from "./Point";

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

export const userCmd: B.BufferParser<UserCmd> = sequenceS(P.Applicative)({
  lerpMs: B.int16_le,
  ms: B.uint8_be,
  viewAngles: pipe(
    P.skip(1),
    P.chain(() => point)
  ),
  forwardMove: B.float32_le,
  sideMove: B.float32_le,
  upMove: B.float32_le,
  lightLevel: B.int8_be,
  buttons: pipe(
    P.skip(1),
    P.chain(() => B.uint16_le)
  ),
  impulse: B.int8_be,
  weaponSelect: B.int8_be,
  impactIndex: pipe(
    P.skip(2),
    P.chain(() => B.int32_le)
  ),
  impactPosition: point,
});
