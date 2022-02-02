import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_BLOODSTREAM = {
  readonly id: TempEntityType.TE_BLOODSTREAM;
  readonly name: "TE_BLOODSTREAM";
  readonly fields: {
    readonly position: Point;
    readonly vector: Point;
    readonly color: number;
    readonly count: number;
  };
};
