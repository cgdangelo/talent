import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_SPRITE = {
  readonly id: TempEntityType.TE_SPRITE;
  readonly name: "TE_SPRITE";
  readonly fields: {
    readonly position: Point;
    readonly spriteIndex: number;
    readonly scale: number;
    readonly brightness: number;
  };
};
