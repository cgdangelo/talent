import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";

export type AddAngle = {
  readonly angleToAdd: number;
};

export const addAngle: B.BufferParser<AddAngle> = P.struct({
  angleToAdd: pipe(
    B.int16_le,
    P.map((a) => a / (65536 / 360))
  ),
});
