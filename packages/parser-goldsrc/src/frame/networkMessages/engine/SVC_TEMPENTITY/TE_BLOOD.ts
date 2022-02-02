import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_BLOOD = {
  readonly id: TempEntityType.TE_BLOOD;
  readonly name: "TE_BLOOD";
  readonly fields: {
    readonly position: Point;
    readonly vector: Point;
    readonly color: number;
    readonly count: number;
  };
};
