import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_ARMOR_RICOCHET = {
  readonly id: TempEntityType.TE_ARMOR_RICOCHET;
  readonly name: "TE_ARMOR_RICOCHET";
  readonly fields: {
    readonly position: Point;
    readonly scale: number;
  };
};
