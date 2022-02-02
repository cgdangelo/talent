import { parser as P } from "@talent/parser";
import type { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "../../../../Point";
import { coordPoint } from "./SVC_TEMPENTITY";
import { TempEntityType } from "./TempEntityType";

export type TE_SHOWLINE = {
  readonly id: TempEntityType.TE_SHOWLINE;
  readonly name: "TE_SHOWLINE";
  readonly fields: {
    readonly startPosition: Point;
    readonly endPosition: Point;
  };
};

export const showLine: B.BufferParser<TE_SHOWLINE> = pipe(
  P.struct({
    startPosition: coordPoint,
    endPosition: coordPoint,
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_SHOWLINE,
    name: "TE_SHOWLINE",
    fields,
  }))
);
