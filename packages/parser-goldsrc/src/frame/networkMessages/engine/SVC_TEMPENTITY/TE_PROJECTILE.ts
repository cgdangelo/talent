import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "../../../../Point";
import { coordPoint } from "../SVC_TEMPENTITY";
import { TempEntityType } from "./TempEntityType";

export type TE_PROJECTILE = {
  readonly id: TempEntityType.TE_PROJECTILE;
  readonly name: "TE_PROJECTILE";
  readonly fields: {
    readonly position: Point;
    readonly velocity: Point;
    readonly modelIndex: number;
    readonly life: number;
    readonly color: number;
  };
};

export const projectile: B.BufferParser<TE_PROJECTILE> = pipe(
  P.struct({
    position: coordPoint,
    velocity: coordPoint,
    modelIndex: B.int16_le,
    life: B.uint8_le,
    color: B.uint8_le,
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_PROJECTILE,
    name: "TE_PROJECTILE",
    fields,
  }))
);
