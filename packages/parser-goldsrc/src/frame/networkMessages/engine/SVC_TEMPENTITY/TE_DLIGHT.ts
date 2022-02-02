import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "../../../../Point";
import { coordPoint } from "./SVC_TEMPENTITY";
import { TempEntityType } from "./TempEntityType";

export type DLight = {
  readonly id: TempEntityType.TE_DLIGHT;
  readonly name: "TE_DLIGHT";
  readonly fields: {
    readonly position: Point;
    readonly radius: number;
    readonly color: {
      readonly r: number;
      readonly g: number;
      readonly b: number;
    };
    readonly life: number;
    readonly decayRate: number;
  };
};

export const dLight: B.BufferParser<DLight> = pipe(
  P.struct({
    position: coordPoint,
    radius: B.uint8_le,
    color: P.struct({
      r: B.uint8_le,
      g: B.uint8_le,
      b: B.uint8_le,
    }),
    life: B.uint8_le,
    decayRate: B.uint8_le,
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_DLIGHT,
    name: "TE_DLIGHT",
    fields,
  }))
);
