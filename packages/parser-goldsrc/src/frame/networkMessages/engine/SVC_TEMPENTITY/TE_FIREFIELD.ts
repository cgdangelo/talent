import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "../../../../Point";
import { coordPoint } from "../SVC_TEMPENTITY";
import { TempEntityType } from "./TempEntityType";

export type FireField = {
  readonly id: TempEntityType.TE_FIREFIELD;
  readonly name: "TE_FIREFIELD";
  readonly fields: {
    readonly origin: Point;
    readonly scale: number;
    readonly modelIndex: number;
    readonly count: number;
    readonly flags: number;
    readonly duration: number;
  };
};

export const fireField: B.BufferParser<FireField> = pipe(
  P.struct({
    origin: coordPoint,
    scale: B.int16_le,
    modelIndex: B.int16_le,
    count: B.uint8_le,
    flags: B.uint8_le,
    duration: B.uint8_le,
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_FIREFIELD,
    name: "TE_FIREFIELD",
    fields,
  }))
);
