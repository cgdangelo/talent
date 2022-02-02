import { parser as P } from "@talent/parser";
import type { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "../../../../Point";
import { coordPoint } from "./SVC_TEMPENTITY";
import { TempEntityType } from "./TempEntityType";

export type TE_SPARKS = {
  readonly id: TempEntityType.TE_SPARKS;
  readonly name: "TE_SPARKS";
  readonly fields: {
    readonly position: Point;
  };
};

export const sparks: B.BufferParser<TE_SPARKS> = pipe(
  P.struct({ position: coordPoint }),

  P.map((fields) => ({
    id: TempEntityType.TE_SPARKS,
    name: "TE_SPARKS",
    fields,
  }))
);
