import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_SPRITE_SPRAY = {
  readonly id: TempEntityType.TE_SPRITE_SPRAY;
  readonly name: "TE_SPRITE_SPRAY";
  readonly fields: {
    readonly position: Point;
    readonly velocity: Point;
    readonly modelIndex: number;
    readonly count: number;
    readonly speed: number;
  };
};
