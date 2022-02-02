import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_PARTICLEBURST = {
  readonly id: TempEntityType.TE_PARTICLEBURST;
  readonly name: "TE_PARTICLEBURST";
  readonly fields: {
    readonly origin: Point;
    readonly scale: number;
    readonly color: number;
    readonly duration: number;
  };
};
