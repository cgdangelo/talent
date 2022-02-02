import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_BUBBLES = {
  readonly id: TempEntityType.TE_BUBBLES;
  readonly name: "TE_BUBBLES";
  readonly fields: {
    readonly minStartPosition: Point;
    readonly maxStartPosition: Point;
    readonly scale: number;
    readonly modelIndex: number;
    readonly count: number;
    readonly speed: number;
  };
};
