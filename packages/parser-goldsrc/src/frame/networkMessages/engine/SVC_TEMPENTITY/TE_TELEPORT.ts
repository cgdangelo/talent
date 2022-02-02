import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_TELEPORT = {
  readonly id: TempEntityType.TE_TELEPORT;
  readonly name: "TE_TELEPORT";
  readonly fields: {
    readonly position: Point;
  };
};
