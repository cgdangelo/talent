import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_BUBBLETRAIL = {
  readonly id: TempEntityType.TE_BUBBLETRAIL;
  readonly name: "TE_BUBBLETRAIL";
  readonly fields: {
    readonly minStartPosition: Point;
    readonly maxStartPosition: Point;
    readonly scale: number;
    readonly modelIndex: number;
    readonly count: number;
    readonly speed: number;
  };
};
