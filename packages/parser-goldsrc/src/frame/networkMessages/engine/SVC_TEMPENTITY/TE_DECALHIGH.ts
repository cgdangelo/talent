import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_DECALHIGH = {
  readonly id: TempEntityType.TE_DECALHIGH;
  readonly name: "TE_DECALHIGH";
  readonly fields: {
    readonly position: Point;
    readonly decalIndex: number;
    readonly entityIndex: number;
  };
};
