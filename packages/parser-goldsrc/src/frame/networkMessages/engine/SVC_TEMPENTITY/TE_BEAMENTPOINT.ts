import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "../../../../Point";
import { coordPoint } from "./SVC_TEMPENTITY";
import { TempEntityType } from "./TempEntityType";

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

export const beamEntPoint: B.BufferParser<TE_BEAMENTPOINT> = pipe(
  P.struct({
    startEntity: B.int16_le,
    endPosition: coordPoint,
    spriteIndex: B.int16_le,
    startFrame: B.uint8_le,
    frameRate: B.uint8_le,
    life: B.uint8_le,
    width: B.uint8_le,
    noise: B.uint8_le,
    color: P.struct({
      r: B.uint8_le,
      g: B.uint8_le,
      b: B.uint8_le,
      a: B.uint8_le,
    }),
    speed: B.uint8_le,
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_BEAMENTPOINT,
    name: "TE_BEAMENTPOINT",
    fields,
  }))
);
