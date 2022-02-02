import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_GUNSHOTDECAL = {
  readonly id: TempEntityType.TE_GUNSHOTDECAL;
  readonly name: "TE_GUNSHOTDECAL";
  readonly fields: {
    readonly position: Point;
    readonly entityIndex: number;
    readonly decal: number;
  };
};
