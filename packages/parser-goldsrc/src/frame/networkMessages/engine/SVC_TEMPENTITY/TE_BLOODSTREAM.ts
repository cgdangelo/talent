import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "../../../../Point";
import { coordPoint } from "./coord";
import { TempEntityType } from "./TempEntityType";

export type Bloodstream = {
  readonly id: TempEntityType.TE_BLOODSTREAM;
  readonly name: "TE_BLOODSTREAM";
  readonly fields: {
    readonly position: Point;
    readonly vector: Point;
    readonly color: number;
    readonly count: number;
  };
};

export const bloodstream: B.BufferParser<Bloodstream> = pipe(
  P.struct({
    position: coordPoint,
    vector: coordPoint,
    color: B.uint8_le,
    count: B.uint8_le,
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_BLOODSTREAM,
    name: "TE_BLOODSTREAM",
    fields,
  }))
);
