import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_TAREXPLOSION = {
  readonly id: TempEntityType.TE_TAREXPLOSION;
  readonly name: "TE_TAREXPLOSION";
  readonly fields: {
    readonly position: Point;
  };
};
