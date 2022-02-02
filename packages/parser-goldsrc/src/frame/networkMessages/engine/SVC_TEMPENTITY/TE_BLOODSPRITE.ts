import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "../../../../Point";
import { coordPoint } from "../SVC_TEMPENTITY";
import { TempEntityType } from "./TempEntityType";

export type BloodSprite = {
  readonly id: TempEntityType.TE_BLOODSPRITE;
  readonly name: "TE_BLOODSPRITE";
  readonly fields: {
    readonly position: Point;
    readonly modelIndex: number;
    readonly decalIndex: number;
    readonly color: number;
    readonly scale: number;
  };
};

export const bloodSprite: B.BufferParser<BloodSprite> = pipe(
  P.struct({
    position: coordPoint,
    modelIndex: B.int16_le,
    decalIndex: B.int16_le,
    color: B.uint8_le,
    scale: B.uint8_le,
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_BLOODSPRITE,
    name: "TE_BLOODSPRITE",
    fields,
  }))
);
