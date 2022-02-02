import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_BLOODSPRITE = {
  readonly id: TempEntityType.TE_BLOODSPRITE;
  readonly name: "TE_BLOODSPRITE";
  readonly fields: {
    readonly position: Point;
    readonly modelIndex: number;
    readonly decalIndex: number;
    readonly color: number;
    readonly scale: number;
  };
};
