import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_GLOWSPRITE = {
  readonly id: TempEntityType.TE_GLOWSPRITE;
  readonly name: "TE_GLOWSPRITE";
  readonly fields: {
    readonly position: Point;
    readonly modelIndex: number;
    readonly scale: number;
    readonly size: number;
    readonly brightness: number;
  };
};
