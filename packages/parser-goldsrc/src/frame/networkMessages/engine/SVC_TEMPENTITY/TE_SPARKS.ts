import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_SPARKS = {
  readonly id: TempEntityType.TE_SPARKS;
  readonly name: "TE_SPARKS";
  readonly fields: {
    readonly position: Point;
  };
};
