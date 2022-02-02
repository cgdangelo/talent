import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_WORLDDECALHIGH = {
  readonly id: TempEntityType.TE_WORLDDECALHIGH;
  readonly name: "TE_WORLDDECALHIGH";
  readonly fields: {
    readonly position: Point;
    readonly decalIndex: number;
  };
};
