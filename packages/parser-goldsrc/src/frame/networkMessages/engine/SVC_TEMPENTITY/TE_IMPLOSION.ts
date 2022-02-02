import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_IMPLOSION = {
  readonly id: TempEntityType.TE_IMPLOSION;
  readonly name: "TE_IMPLOSION";
  readonly fields: {
    readonly position: Point;
    readonly radius: number;
    readonly count: number;
    readonly life: number;
  };
};
