import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "../../../../Point";
import { coordPoint } from "./SVC_TEMPENTITY";
import { TempEntityType } from "./TempEntityType";

export type TE_EXPLOSION2 = {
  readonly id: TempEntityType.TE_EXPLOSION2;
  readonly name: "TE_EXPLOSION2";
  readonly fields: {
    readonly position: Point;
    readonly color: number;
    readonly count: number;
  };
};

export const explosion2: B.BufferParser<TE_EXPLOSION2> = pipe(
  P.struct({
    position: coordPoint,
    color: B.uint8_le,
    count: B.uint8_le,
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_EXPLOSION2,
    name: "TE_EXPLOSION2",
    fields,
  }))
);
