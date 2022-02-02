import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_FIREFIELD = {
  readonly id: TempEntityType.TE_FIREFIELD;
  readonly name: "TE_FIREFIELD";
  readonly fields: {
    readonly origin: Point;
    readonly scale: number;
    readonly modelIndex: number;
    readonly count: number;
    readonly flags: number;
    readonly duration: number;
  };
};
