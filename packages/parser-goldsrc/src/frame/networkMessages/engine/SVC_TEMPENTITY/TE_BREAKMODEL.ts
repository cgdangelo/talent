import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_BREAKMODEL = {
  readonly id: TempEntityType.TE_BREAKMODEL;
  readonly name: "TE_BREAKMODEL";
  readonly fields: {
    readonly position: Point;
    readonly size: Point;
    readonly velocity: Point;
    readonly velocityRandomness: number;
    readonly objectIndex: number;
    readonly count: number;
    readonly life: number;
    readonly flags: number;
  };
};
