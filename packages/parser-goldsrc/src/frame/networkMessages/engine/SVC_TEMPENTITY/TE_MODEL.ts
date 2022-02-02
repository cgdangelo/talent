import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_MODEL = {
  readonly id: TempEntityType.TE_MODEL;
  readonly name: "TE_MODEL";
  readonly fields: {
    readonly position: Point;
    readonly velocity: Point;
    readonly angle: {
      readonly pitch: number;
      readonly yaw: number;
      readonly roll: number;
    };
    readonly modelIndex: number;
    readonly flags: number;
    readonly life: number;
  };
};
