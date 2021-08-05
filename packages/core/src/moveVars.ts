import { parser as P } from "@talent/parser";
import { sequenceS } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";

export type MoveVars = {
  readonly gravity: number;
  readonly stopSpeed: number;
  readonly maxSpeed: number;
  readonly spectatorMaxSpeed: number;
  readonly accelerate: number;
  readonly airAccelerate: number;
  readonly waterAccelerate: number;
  readonly friction: number;
  readonly edgeFriction: number;
  readonly waterFriction: number;
  readonly entGravity: number;
  readonly bounce: number;
  readonly stepSize: number;
  readonly maxVelocity: number;
  readonly zMax: number;
  readonly waveHeight: number;
  readonly footsteps: number;
  readonly skyName: string;
  readonly rollAngle: number;
  readonly rollSpeed: number;
  readonly skyColor: {
    readonly r: number;
    readonly g: number;
    readonly b: number;
  };
  readonly skyVec: P.Point;
};

export const moveVars: P.Parser<Buffer, MoveVars> = sequenceS(P.Applicative)({
  gravity: P.float32_le,
  stopSpeed: P.float32_le,
  maxSpeed: P.float32_le,
  spectatorMaxSpeed: P.float32_le,
  accelerate: P.float32_le,
  airAccelerate: P.float32_le,
  waterAccelerate: P.float32_le,
  friction: P.float32_le,
  edgeFriction: P.float32_le,
  waterFriction: P.float32_le,
  entGravity: P.float32_le,
  bounce: P.float32_le,
  stepSize: P.float32_le,
  maxVelocity: P.float32_le,
  zMax: P.float32_le,
  waveHeight: P.float32_le,
  footsteps: P.int32_le,
  skyName: P.str(32),
  rollAngle: P.float32_le,
  rollSpeed: P.float32_le,
  skyColor: pipe(
    P.point,
    P.map(({ x: r, y: g, z: b }) => ({ r, g, b }))
  ),
  skyVec: P.point,
});
