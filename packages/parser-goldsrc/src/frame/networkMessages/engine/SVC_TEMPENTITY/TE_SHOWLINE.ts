import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_SHOWLINE = {
  readonly id: TempEntityType.TE_SHOWLINE;
  readonly name: "TE_SHOWLINE";
  readonly fields: {
    readonly startPosition: Point;
    readonly endPosition: Point;
  };
};
