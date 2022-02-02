import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_LINE = {
  readonly id: TempEntityType.TE_LINE;
  readonly name: "TE_LINE";
  readonly fields: {
    readonly startPosition: Point;
    readonly endPosition: Point;
    readonly life: number;
    readonly color: {
      readonly r: number;
      readonly g: number;
      readonly b: number;
    };
  };
};
