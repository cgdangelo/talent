import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "../../../../Point";
import { coordPoint } from "./SVC_TEMPENTITY";
import { TempEntityType } from "./TempEntityType";

export type TE_EXPLOSION = {
  readonly id: TempEntityType.TE_EXPLOSION;
  readonly name: "TE_EXPLOSION";
  readonly fields: {
    readonly position: Point;
    readonly spriteIndex: number;
    readonly scale: number;
    readonly frameRate: number;
    readonly flags: number;
  };
};

export const explosion: B.BufferParser<TE_EXPLOSION> = pipe(
  P.struct({
    position: coordPoint,
    spriteIndex: B.int16_le,
    scale: B.uint8_le,
    frameRate: B.uint8_le,
    flags: B.uint8_le,
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_EXPLOSION,
    name: "TE_EXPLOSION",
    fields,
  }))
);
