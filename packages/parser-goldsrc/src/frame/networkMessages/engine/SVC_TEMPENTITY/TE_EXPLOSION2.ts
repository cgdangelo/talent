import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_EXPLOSION2 = {
  readonly id: TempEntityType.TE_EXPLOSION2;
  readonly name: "TE_EXPLOSION2";
  readonly fields: {
    readonly position: Point;
    readonly color: number;
    readonly count: number;
  };
};
