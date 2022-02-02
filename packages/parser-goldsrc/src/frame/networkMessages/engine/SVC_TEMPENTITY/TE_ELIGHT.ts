import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_ELIGHT = {
  readonly id: TempEntityType.TE_ELIGHT;
  readonly name: "TE_ELIGHT";
  readonly fields: {
    readonly entityIndex: number;
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
