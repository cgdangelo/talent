import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_EXPLOSION = {
  readonly id: TempEntityType.TE_EXPLOSION;
  readonly name: "TE_EXPLOSION";
  readonly fields: {
    readonly position: Point;
    readonly spriteIndex: number;
    readonly scale: number;
    readonly frameRate: number;
    readonly flags: number;
  };
};
