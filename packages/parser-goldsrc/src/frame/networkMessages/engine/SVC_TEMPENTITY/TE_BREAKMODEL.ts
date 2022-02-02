import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "../../../../Point";
import { coordPoint } from "../SVC_TEMPENTITY";
import { TempEntityType } from "./TempEntityType";

export type BreakModel = {
  readonly id: TempEntityType.TE_BREAKMODEL;
  readonly name: "TE_BREAKMODEL";
  readonly fields: {
    readonly position: Point;
    readonly size: Point;
    readonly velocity: Point;
    readonly velocityRandomness: number;
    readonly objectIndex: number;
    readonly count: number;
    readonly life: number;
    readonly flags: number;
  };
};

export const breakModel: B.BufferParser<BreakModel> = pipe(
  P.struct({
    position: coordPoint,
    size: coordPoint,
    velocity: coordPoint,
    velocityRandomness: B.uint8_le,
    objectIndex: B.int16_le,
    count: B.uint8_le,
    life: B.uint8_le,
    flags: B.uint8_le,
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_BREAKMODEL,
    name: "TE_BREAKMODEL",
    fields,
  }))
);
