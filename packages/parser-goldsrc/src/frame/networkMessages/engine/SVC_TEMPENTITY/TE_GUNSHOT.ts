import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_GUNSHOT = {
  readonly id: TempEntityType.TE_GUNSHOT;
  readonly name: "TE_GUNSHOT";
  readonly fields: {
    readonly position: Point;
  };
};
