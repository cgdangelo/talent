import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_SPRITETRAIL = {
  readonly id: TempEntityType.TE_SPRITETRAIL;
  readonly name: "TE_SPRITETRAIL";
  readonly fields: {
    readonly startPosition: Point;
    readonly endPosition: Point;
    readonly spriteIndex: number;
    readonly count: number;
    readonly life: number;
    readonly scale: number;
    readonly velocity: number;
    readonly velocityRandomness: number;
  };
};
