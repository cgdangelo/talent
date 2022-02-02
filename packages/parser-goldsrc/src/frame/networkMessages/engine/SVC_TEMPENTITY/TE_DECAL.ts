import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "../../../../Point";
import { coordPoint } from "./SVC_TEMPENTITY";
import { TempEntityType } from "./TempEntityType";

export type TE_DECAL = {
  readonly id: TempEntityType.TE_DECAL;
  readonly name: "TE_DECAL";
  readonly fields: {
    readonly position: Point;
    readonly decalIndex: number;
    readonly entityIndex: number;
  };
};

export const decal: B.BufferParser<TE_DECAL> = pipe(
  P.struct({
    position: coordPoint,
    decalIndex: B.uint8_le,
    entityIndex: B.int16_le,
  }),

  P.map((fields) => ({ id: TempEntityType.TE_DECAL, name: "TE_DECAL", fields }))
);
