import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_BEAMPOINTS = {
  readonly id: TempEntityType.TE_BEAMPOINTS;
  readonly name: "TE_BEAMPOINTS";
  readonly fields: {
    readonly startPosition: Point;
    readonly endPosition: Point;
    readonly spriteIndex: number;
    readonly startFrame: number;
    readonly frameRate: number;
    readonly life: number;
    readonly width: number;
    readonly noise: number;
    readonly color: {
      readonly r: number;
      readonly g: number;
      readonly b: number;
      readonly a: number;
    };
    readonly speed: number;
  };
};
