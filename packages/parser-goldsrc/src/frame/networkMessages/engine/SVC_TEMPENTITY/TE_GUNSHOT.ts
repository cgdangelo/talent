import { parser as P } from "@talent/parser";
import type { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "../../../../Point";
import { coordPoint } from "./SVC_TEMPENTITY";
import { TempEntityType } from "./TempEntityType";

export type TE_GUNSHOT = {
  readonly id: TempEntityType.TE_GUNSHOT;
  readonly name: "TE_GUNSHOT";
  readonly fields: {
    readonly position: Point;
  };
};

export const gunshot: B.BufferParser<TE_GUNSHOT> = pipe(
  P.struct({ position: coordPoint }),

  P.map((fields) => ({
    id: TempEntityType.TE_GUNSHOT,
    name: "TE_GUNSHOT",
    fields,
  }))
);
