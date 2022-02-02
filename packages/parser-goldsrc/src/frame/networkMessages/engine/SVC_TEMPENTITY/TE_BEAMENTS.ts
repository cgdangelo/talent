import type { TempEntityType } from "./TempEntityType";

export type TE_BEAMENTS = {
  readonly id: TempEntityType.TE_BEAMENTS;
  readonly name: "TE_BEAMENTS";
  readonly fields: {
    readonly startEntity: number;
    readonly endEntity: number;
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
