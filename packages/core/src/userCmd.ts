import { parser as P } from "@talent/parser";
import { sequenceS } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";

export type UserCmd = {
  readonly lerpMs: number;
  readonly ms: number;
  readonly viewAngles: P.Point;
  readonly forwardMove: number;
  readonly sideMove: number;
  readonly upMove: number;
  readonly lightLevel: number;
  readonly buttons: number;
  readonly impulse: number;
  readonly weaponSelect: number;
  readonly impactIndex: number;
  readonly impactPosition: P.Point;
};

export const userCmd: P.Parser<Buffer, UserCmd> = sequenceS(P.Applicative)({
  lerpMs: P.int16_le,
  ms: P.uint8_be,
  viewAngles: pipe(
    P.skip(1),
    P.chain(() => P.point)
  ),
  forwardMove: P.float32_le,
  sideMove: P.float32_le,
  upMove: P.float32_le,
  lightLevel: P.int8_be,
  buttons: pipe(
    P.skip(1),
    P.chain(() => P.uint16_le)
  ),
  impulse: P.int8_be,
  weaponSelect: P.int8_be,
  impactIndex: pipe(
    P.skip(2),
    P.chain(() => P.int32_le)
  ),
  impactPosition: P.point,
});
