import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import { TempEntityType } from "./TempEntityType";

export type BeamFollow = {
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

export const beamFollow: B.BufferParser<BeamFollow> = pipe(
  P.struct({
    startEntity: B.int16_le,
    spriteIndex: B.int16_le,
    life: B.uint8_le,
    width: B.uint8_le,
    color: P.struct({
      r: B.uint8_le,
      g: B.uint8_le,
      b: B.uint8_le,
      a: B.uint8_le,
    }),
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_BEAMFOLLOW,
    name: "TE_BEAMFOLLOW",
    fields,
  }))
);
