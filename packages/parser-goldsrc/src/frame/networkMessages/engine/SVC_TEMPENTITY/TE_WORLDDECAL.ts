import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_WORLDDECAL = {
  readonly id: TempEntityType.TE_WORLDDECAL;
  readonly name: "TE_WORLDDECAL";
  readonly fields: {
    readonly position: Point;
    readonly textureIndex: number;
  };
};
