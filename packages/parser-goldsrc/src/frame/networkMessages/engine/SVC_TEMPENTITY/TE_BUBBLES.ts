import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "../../../../Point";
import { coord, coordPoint } from "../SVC_TEMPENTITY";
import { TempEntityType } from "./TempEntityType";

export type Bubbles = {
  readonly id: TempEntityType.TE_BUBBLES;
  readonly name: "TE_BUBBLES";
  readonly fields: {
    readonly minStartPosition: Point;
    readonly maxStartPosition: Point;
    readonly scale: number;
    readonly modelIndex: number;
    readonly count: number;
    readonly speed: number;
  };
};

export const bubbles: B.BufferParser<Bubbles> = pipe(
  P.struct({
    minStartPosition: coordPoint,
    maxStartPosition: coordPoint,
    scale: coord,
    modelIndex: B.int16_le,
    count: B.uint8_le,
    speed: B.uint8_le,
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_BUBBLES,
    name: "TE_BUBBLES",
    fields,
  }))
);
