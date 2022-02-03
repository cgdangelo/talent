import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "../../../../Point";
import { coordPoint } from "./coord";
import { TempEntityType } from "./TempEntityType";

export type Blood = {
  readonly id: TempEntityType.TE_BLOOD;
  readonly name: "TE_BLOOD";
  readonly fields: {
    readonly position: Point;
    readonly vector: Point;
    readonly color: number;
    readonly count: number;
  };
};

export const blood: B.BufferParser<Blood> = pipe(
  P.struct({
    position: coordPoint,
    vector: coordPoint,
    color: B.uint8_le,
    count: B.uint8_le,
  }),

  P.map((fields) => ({ id: TempEntityType.TE_BLOOD, name: "TE_BLOOD", fields }))
);
