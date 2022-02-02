import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_BSPDECAL = {
  readonly id: TempEntityType.TE_BSPDECAL;
  readonly name: "TE_BSPDECAL";
  readonly fields: {
    readonly position: Point;
    readonly decalIndex: number;
    readonly entityIndex: number;
    readonly modelIndex?: number;
  };
};
