import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_DLIGHT = {
  readonly id: TempEntityType.TE_DLIGHT;
  readonly name: "TE_DLIGHT";
  readonly fields: {
    readonly position: Point;
    readonly radius: number;
    readonly color: {
      readonly r: number;
      readonly g: number;
      readonly b: number;
    };
    readonly life: number;
    readonly decayRate: number;
  };
};
