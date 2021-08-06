import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { sequenceS } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";
import type { Point} from "./Point";
import { point } from "./Point";

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
  readonly skyVec: Point;
};

export const moveVars: B.BufferParser<MoveVars> = sequenceS(P.Applicative)({
  gravity: B.float32_le,
  stopSpeed: B.float32_le,
  maxSpeed: B.float32_le,
  spectatorMaxSpeed: B.float32_le,
  accelerate: B.float32_le,
  airAccelerate: B.float32_le,
  waterAccelerate: B.float32_le,
  friction: B.float32_le,
  edgeFriction: B.float32_le,
  waterFriction: B.float32_le,
  entGravity: B.float32_le,
  bounce: B.float32_le,
  stepSize: B.float32_le,
  maxVelocity: B.float32_le,
  zMax: B.float32_le,
  waveHeight: B.float32_le,
  footsteps: B.int32_le,
  skyName: B.str(32),
  rollAngle: B.float32_le,
  rollSpeed: B.float32_le,
  skyColor: pipe(
    point,
    P.map(({ x: r, y: g, z: b }) => ({ r, g, b }))
  ),
  skyVec: point,
});
