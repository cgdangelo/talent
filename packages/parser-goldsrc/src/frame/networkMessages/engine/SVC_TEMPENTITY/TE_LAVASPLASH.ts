import { parser as P } from "@talent/parser";
import type { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "../../../../Point";
import { coordPoint } from "./SVC_TEMPENTITY";
import { TempEntityType } from "./TempEntityType";

export type LavaSplash = {
  readonly id: TempEntityType.TE_LAVASPLASH;
  readonly name: "TE_LAVASPLASH";
  readonly fields: {
    readonly position: Point;
  };
};

export const lavaSplash: B.BufferParser<LavaSplash> = pipe(
  P.struct({ position: coordPoint }),

  P.map((fields) => ({
    id: TempEntityType.TE_LAVASPLASH,
    name: "TE_LAVASPLASH",
    fields,
  }))
);
