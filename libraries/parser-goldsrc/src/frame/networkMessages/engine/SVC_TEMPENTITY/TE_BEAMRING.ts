import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import { TempEntityType } from "./TempEntityType";

export type BeamRing = {
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

export const beamRing: B.BufferParser<BeamRing> = pipe(
  P.struct({
    startEntity: B.int16_le,
    endEntity: B.int16_le,
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
    id: TempEntityType.TE_BEAMRING,
    name: "TE_BEAMRING",
    fields,
  }))
);
