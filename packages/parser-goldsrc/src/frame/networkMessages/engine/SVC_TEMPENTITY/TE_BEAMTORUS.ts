import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "../../../../Point";
import { coordPoint } from "./coord";
import { TempEntityType } from "./TempEntityType";

export type BeamToRus = {
  readonly id: TempEntityType.TE_BEAMTORUS;
  readonly name: "TE_BEAMTORUS";
  readonly fields: {
    readonly position: Point;
    readonly axis: Point;
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

export const beamToRus: B.BufferParser<BeamToRus> = pipe(
  P.struct({
    position: coordPoint,
    axis: coordPoint,
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
    id: TempEntityType.TE_BEAMTORUS,
    name: "TE_BEAMTORUS",
    fields,
  }))
);
