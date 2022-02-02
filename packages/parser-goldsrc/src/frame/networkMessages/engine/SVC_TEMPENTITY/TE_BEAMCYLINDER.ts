import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_BEAMCYLINDER = {
  readonly id: TempEntityType.TE_BEAMCYLINDER;
  readonly name: "TE_BEAMCYLINDER";
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
