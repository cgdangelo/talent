import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_SMOKE = {
  readonly id: TempEntityType.TE_SMOKE;
  readonly name: "TE_SMOKE";
  readonly fields: {
    readonly position: Point;
    readonly spriteIndex: number;
    readonly scale: number;
    readonly frameRate: number;
  };
};
