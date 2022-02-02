import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "../../../../Point";
import { coord, coordPoint } from "../SVC_TEMPENTITY";
import { TempEntityType } from "./TempEntityType";

export type TE_EXPLODEMODEL = {
  readonly id: TempEntityType.TE_EXPLODEMODEL;
  readonly name: "TE_EXPLODEMODEL";
  readonly fields: {
    readonly position: Point;
    readonly velocity: number;
    readonly modelIndex: number;
    readonly count: number;
    readonly life: number;
  };
};

export const explodeModel: B.BufferParser<TE_EXPLODEMODEL> = pipe(
  P.struct({
    position: coordPoint,
    velocity: coord,
    modelIndex: B.int16_le,
    count: B.int16_le,
    life: B.uint8_le,
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_EXPLODEMODEL,
    name: "TE_EXPLODEMODEL",
    fields,
  }))
);
