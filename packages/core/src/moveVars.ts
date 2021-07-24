import { either as E } from "fp-ts";
import { sequenceS } from "fp-ts/lib/Apply";
import { int32_le, Point } from "./parser";
import { float32_le, point, str } from "./parser";

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
  readonly skyColorR: number;
  readonly skyColorG: number;
  readonly skyColorB: number;
  readonly skyVec: Point;
};

export const moveVars =
  (buffer: Buffer) =>
  (cursor = 0): E.Either<Error, MoveVars> =>
    // prettier-ignore
    sequenceS(E.Applicative)({
      gravity:           float32_le  (buffer)(cursor),
      stopSpeed:         float32_le  (buffer)(cursor + 4),
      maxSpeed:          float32_le  (buffer)(cursor + 4 + 4),
      spectatorMaxSpeed: float32_le  (buffer)(cursor + 4 + 4 + 4),
      accelerate:        float32_le  (buffer)(cursor + 4 + 4 + 4 + 4),
      airAccelerate:     float32_le  (buffer)(cursor + 4 + 4 + 4 + 4 + 4),
      waterAccelerate:   float32_le  (buffer)(cursor + 4 + 4 + 4 + 4 + 4 + 4),
      friction:          float32_le  (buffer)(cursor + 4 + 4 + 4 + 4 + 4 + 4 + 4),
      edgeFriction:      float32_le  (buffer)(cursor + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4),
      waterFriction:     float32_le  (buffer)(cursor + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4),
      entGravity:        float32_le  (buffer)(cursor + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4),
      bounce:            float32_le  (buffer)(cursor + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4),
      stepSize:          float32_le  (buffer)(cursor + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4),
      maxVelocity:       float32_le  (buffer)(cursor + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4),
      zMax:              float32_le  (buffer)(cursor + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4),
      waveHeight:        float32_le  (buffer)(cursor + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4),
      footsteps:         int32_le    (buffer)(cursor + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4),
      skyName:     E.of( str         (buffer)(cursor + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4)(32)),
      rollAngle:         float32_le  (buffer)(cursor + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 32),
      rollSpeed:         float32_le  (buffer)(cursor + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 32 + 4),
      skyColorR:         float32_le  (buffer)(cursor + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 32 + 4 + 4),
      skyColorG:         float32_le  (buffer)(cursor + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 32 + 4 + 4 + 4),
      skyColorB:         float32_le  (buffer)(cursor + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 32 + 4 + 4 + 4 + 4),
      skyVec:            point       (buffer)(cursor + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 32 + 4 + 4 + 4 + 4 + 4),
    });
