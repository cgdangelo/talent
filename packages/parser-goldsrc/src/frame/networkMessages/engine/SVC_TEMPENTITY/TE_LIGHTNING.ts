import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "../../../../Point";
import { coordPoint } from "./SVC_TEMPENTITY";
import { TempEntityType } from "./TempEntityType";

export type Lightning = {
  readonly id: TempEntityType.TE_LIGHTNING;
  readonly name: "TE_LIGHTNING";
  readonly fields: {
    readonly startPosition: Point;
    readonly endPosition: Point;
    readonly life: number;
    readonly width: number;
    readonly noise: number;
    readonly modelIndex: number;
  };
};

export const lightning: B.BufferParser<Lightning> = pipe(
  P.struct({
    startPosition: coordPoint,
    endPosition: coordPoint,
    life: B.uint8_le,
    width: B.uint8_le,
    noise: B.uint8_le,
    modelIndex: B.int16_le,
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_LIGHTNING,
    name: "TE_LIGHTNING",
    fields,
  }))
);
