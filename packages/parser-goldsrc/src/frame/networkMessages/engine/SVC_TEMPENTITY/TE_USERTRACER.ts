import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_USERTRACER = {
  readonly id: TempEntityType.TE_USERTRACER;
  readonly name: "TE_USERTRACER";
  readonly fields: {
    readonly origin: Point;
    readonly velocity: Point;
    readonly life: number;
    readonly color: number;
    readonly scale: number;
  };
};
