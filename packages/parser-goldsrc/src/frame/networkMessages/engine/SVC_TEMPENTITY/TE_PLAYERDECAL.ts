import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_PLAYERDECAL = {
  readonly id: TempEntityType.TE_PLAYERDECAL;
  readonly name: "TE_PLAYERDECAL";
  readonly fields: {
    readonly playerIndex: number;
    readonly position: Point;
    readonly entityIndex: number;
    readonly decalIndex: number;
  };
};
