import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_BEAMTORUS = {
  readonly id: TempEntityType.TE_BEAMTORUS;
  readonly name: "TE_BEAMTORUS";
  readonly fields: {
    readonly position: Point;
    readonly axis: Point;
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
