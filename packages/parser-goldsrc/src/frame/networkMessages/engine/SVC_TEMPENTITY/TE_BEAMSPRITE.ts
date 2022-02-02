import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_BEAMSPRITE = {
  readonly id: TempEntityType.TE_BEAMSPRITE;
  readonly name: "TE_BEAMSPRITE";
  readonly fields: {
    readonly startPosition: Point;
    readonly endPosition: Point;
    readonly beamSpriteIndex: number;
    readonly endSpriteIndex: number;
  };
};
