import type { TempEntityType } from "./TempEntityType";

export type TE_BEAMFOLLOW = {
  readonly id: TempEntityType.TE_BEAMFOLLOW;
  readonly name: "TE_BEAMFOLLOW";
  readonly fields: {
    readonly startEntity: number;
    readonly spriteIndex: number;
    readonly life: number;
    readonly width: number;
    readonly color: {
      readonly r: number;
      readonly g: number;
      readonly b: number;
      readonly a: number;
    };
  };
};
