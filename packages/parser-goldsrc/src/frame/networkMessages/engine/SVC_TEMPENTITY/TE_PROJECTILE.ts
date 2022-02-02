import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_PROJECTILE = {
  readonly id: TempEntityType.TE_PROJECTILE;
  readonly name: "TE_PROJECTILE";
  readonly fields: {
    readonly position: Point;
    readonly velocity: Point;
    readonly modelIndex: number;
    readonly life: number;
    readonly color: number;
  };
};
