import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "../../../../Point";
import { coordPoint } from "../SVC_TEMPENTITY";
import { TempEntityType } from "./TempEntityType";

export type TE_GUNSHOTDECAL = {
  readonly id: TempEntityType.TE_GUNSHOTDECAL;
  readonly name: "TE_GUNSHOTDECAL";
  readonly fields: {
    readonly position: Point;
    readonly entityIndex: number;
    readonly decal: number;
  };
};

export const gunshotDecal: B.BufferParser<TE_GUNSHOTDECAL> = pipe(
  P.struct({
    position: coordPoint,
    entityIndex: B.int16_le,
    decal: B.uint8_le,
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_GUNSHOTDECAL,
    name: "TE_GUNSHOTDECAL",
    fields,
  }))
);
