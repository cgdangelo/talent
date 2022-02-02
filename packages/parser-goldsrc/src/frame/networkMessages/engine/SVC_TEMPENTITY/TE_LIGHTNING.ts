import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_LIGHTNING = {
  readonly id: TempEntityType.TE_LIGHTNING;
  readonly name: "TE_LIGHTNING";
  readonly fields: {
    readonly startPosition: Point;
    readonly endPosition: Point;
    readonly life: number;
    readonly width: number;
    readonly noise: number;
    readonly modelIndex: number;
  };
};
