import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "../../../../Point";
import { coordPoint } from "./SVC_TEMPENTITY";
import { TempEntityType } from "./TempEntityType";

export type TE_IMPLOSION = {
  readonly id: TempEntityType.TE_IMPLOSION;
  readonly name: "TE_IMPLOSION";
  readonly fields: {
    readonly position: Point;
    readonly radius: number;
    readonly count: number;
    readonly life: number;
  };
};

export const implosion: B.BufferParser<TE_IMPLOSION> = pipe(
  P.struct({
    position: coordPoint,
    radius: B.uint8_le,
    count: B.uint8_le,
    life: B.uint8_le,
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_IMPLOSION,
    name: "TE_IMPLOSION",
    fields,
  }))
);
