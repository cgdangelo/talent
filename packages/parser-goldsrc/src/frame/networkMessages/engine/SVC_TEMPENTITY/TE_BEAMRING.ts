import type { TempEntityType } from "./TempEntityType";

export type TE_BEAMRING = {
  readonly id: TempEntityType.TE_BEAMRING;
  readonly name: "TE_BEAMRING";
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
