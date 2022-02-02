import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_MULTIGUNSHOT = {
  readonly id: TempEntityType.TE_MULTIGUNSHOT;
  readonly name: "TE_MULTIGUNSHOT";
  readonly fields: {
    readonly origin: Point;
    readonly direction: Point;
    readonly noise: Point;
  };
};
