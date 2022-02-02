import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_BEAMENTPOINT = {
  readonly id: TempEntityType.TE_BEAMENTPOINT;
  readonly name: "TE_BEAMENTPOINT";
  readonly fields: {
    readonly startEntity: number;
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
