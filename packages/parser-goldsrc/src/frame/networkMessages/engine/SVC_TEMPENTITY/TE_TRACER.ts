import { parser as P } from "@talent/parser";
import type { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "../../../../Point";
import { coordPoint } from "./SVC_TEMPENTITY";
import { TempEntityType } from "./TempEntityType";

export type TE_TRACER = {
  readonly id: TempEntityType.TE_TRACER;
  readonly name: "TE_TRACER";
  readonly fields: {
    readonly startPosition: Point;
    readonly endPosition: Point;
  };
};

export const tracer: B.BufferParser<TE_TRACER> = pipe(
  P.struct({
    startPosition: coordPoint,
    endPosition: coordPoint,
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_TRACER,
    name: "TE_TRACER",
    fields,
  }))
);
