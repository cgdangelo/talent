import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "../../../../Point";
import { coordPoint } from "./SVC_TEMPENTITY";
import { TempEntityType } from "./TempEntityType";

export type SpriteTrail = {
  readonly id: TempEntityType.TE_SPRITETRAIL;
  readonly name: "TE_SPRITETRAIL";
  readonly fields: {
    readonly startPosition: Point;
    readonly endPosition: Point;
    readonly spriteIndex: number;
    readonly count: number;
    readonly life: number;
    readonly scale: number;
    readonly velocity: number;
    readonly velocityRandomness: number;
  };
};

export const spriteTrail: B.BufferParser<SpriteTrail> = pipe(
  P.struct({
    startPosition: coordPoint,
    endPosition: coordPoint,
    spriteIndex: B.int16_le,
    count: B.uint8_le,
    life: B.uint8_le,
    scale: B.uint8_le,
    velocity: B.uint8_le,
    velocityRandomness: B.uint8_le,
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_SPRITETRAIL,
    name: "TE_SPRITETRAIL",
    fields,
  }))
);
