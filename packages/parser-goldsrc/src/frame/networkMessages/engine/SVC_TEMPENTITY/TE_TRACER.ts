import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_TRACER = {
  readonly id: TempEntityType.TE_TRACER;
  readonly name: "TE_TRACER";
  readonly fields: {
    readonly startPosition: Point;
    readonly endPosition: Point;
  };
};
