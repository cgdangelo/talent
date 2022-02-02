import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "../../../../Point";
import { coordPoint } from "./SVC_TEMPENTITY";
import { TempEntityType } from "./TempEntityType";

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

export const beamSprite: B.BufferParser<TE_BEAMSPRITE> = pipe(
  P.struct({
    startPosition: coordPoint,
    endPosition: coordPoint,
    beamSpriteIndex: B.int16_le,
    endSpriteIndex: B.int16_le,
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_BEAMSPRITE,
    name: "TE_BEAMSPRITE",
    fields,
  }))
);
