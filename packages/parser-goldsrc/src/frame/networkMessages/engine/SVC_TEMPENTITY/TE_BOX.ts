import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_BOX = {
  readonly id: TempEntityType.TE_BOX;
  readonly name: "TE_BOX";
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
