import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "../../../../Point";
import { coordPoint } from "../SVC_TEMPENTITY";
import { TempEntityType } from "./TempEntityType";

export type Spray = {
  readonly id: TempEntityType.TE_SPRAY;
  readonly name: "TE_SPRAY";
  readonly fields: {
    readonly position: Point;
    readonly direction: Point;
    readonly modelIndex: number;
    readonly count: number;
    readonly speed: number;
    readonly noise: number;
    readonly renderMode: number;
  };
};

export const spray: B.BufferParser<Spray> = pipe(
  P.struct({
    position: coordPoint,
    direction: coordPoint,
    modelIndex: B.int16_le,
    count: B.uint8_le,
    speed: B.uint8_le,
    noise: B.uint8_le,
    renderMode: B.uint8_le,
  }),

  P.map((fields) => ({ id: TempEntityType.TE_SPRAY, name: "TE_SPRAY", fields }))
);
