import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_DECAL = {
  readonly id: TempEntityType.TE_DECAL;
  readonly name: "TE_DECAL";
  readonly fields: {
    readonly position: Point;
    readonly decalIndex: number;
    readonly entityIndex: number;
  };
};
