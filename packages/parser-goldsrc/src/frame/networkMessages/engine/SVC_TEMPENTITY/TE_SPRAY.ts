import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_SPRAY = {
  readonly id: TempEntityType.TE_SPRAY;
  readonly name: "TE_SPRAY";
  readonly fields: {
    readonly position: Point;
    readonly direction: Point;
    readonly modelIndex: number;
    readonly count: number;
    readonly speed: number;
    readonly noise: number;
    readonly renderMode: number;
  };
};
