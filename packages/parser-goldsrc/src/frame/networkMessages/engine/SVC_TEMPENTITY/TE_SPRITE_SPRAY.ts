import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "../../../../Point";
import { coordPoint } from "../SVC_TEMPENTITY";
import { TempEntityType } from "./TempEntityType";

export type TE_SPRITE_SPRAY = {
  readonly id: TempEntityType.TE_SPRITE_SPRAY;
  readonly name: "TE_SPRITE_SPRAY";
  readonly fields: {
    readonly position: Point;
    readonly velocity: Point;
    readonly modelIndex: number;
    readonly count: number;
    readonly speed: number;
  };
};

export const spriteSpray: B.BufferParser<TE_SPRITE_SPRAY> = pipe(
  P.struct({
    position: coordPoint,
    velocity: coordPoint,
    modelIndex: B.int16_le,
    count: B.uint8_le,
    speed: B.uint8_le,
    random: B.uint8_le,
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_SPRITE_SPRAY,
    name: "TE_SPRITE_SPRAY",
    fields,
  }))
);
