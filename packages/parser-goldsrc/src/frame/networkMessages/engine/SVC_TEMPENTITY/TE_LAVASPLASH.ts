import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_LAVASPLASH = {
  readonly id: TempEntityType.TE_LAVASPLASH;
  readonly name: "TE_LAVASPLASH";
  readonly fields: {
    readonly position: Point;
  };
};
