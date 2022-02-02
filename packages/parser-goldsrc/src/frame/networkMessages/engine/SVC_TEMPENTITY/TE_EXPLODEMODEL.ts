import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_EXPLODEMODEL = {
  readonly id: TempEntityType.TE_EXPLODEMODEL;
  readonly name: "TE_EXPLODEMODEL";
  readonly fields: {
    readonly position: Point;
    readonly velocity: number;
    readonly modelIndex: number;
    readonly count: number;
    readonly life: number;
  };
};
