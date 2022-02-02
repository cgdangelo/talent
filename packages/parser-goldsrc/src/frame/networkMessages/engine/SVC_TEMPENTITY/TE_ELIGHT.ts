import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "../../../../Point";
import { coordPoint } from "./SVC_TEMPENTITY";
import { TempEntityType } from "./TempEntityType";

export type TE_ELIGHT = {
  readonly id: TempEntityType.TE_ELIGHT;
  readonly name: "TE_ELIGHT";
  readonly fields: {
    readonly entityIndex: number;
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

export const eLight: B.BufferParser<TE_ELIGHT> = pipe(
  P.struct({
    entityIndex: B.int16_le,
    position: coordPoint,
    radius: B.uint8_le,
    color: P.struct({
      r: B.uint8_le,
      g: B.uint8_le,
      b: B.uint8_le,
    }),
    life: B.uint8_le,
  }),

  P.bind("decayRate", () =>
    pipe(
      B.int16_le
      // P.map((a) => (life !== 0 ? a / life : a))
    )
  ),

  P.map((fields) => ({
    id: TempEntityType.TE_ELIGHT,
    name: "TE_ELIGHT",
    fields,
  }))
);
