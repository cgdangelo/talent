import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_STREAK_SPLASH = {
  readonly id: TempEntityType.TE_STREAK_SPLASH;
  readonly name: "TE_STREAK_SPLASH";
  readonly fields: {
    readonly startPosition: Point;
    readonly vector: Point;
    readonly color: number;
    readonly count: number;
    readonly velocity: number;
    readonly velocityRandomness: number;
  };
};
