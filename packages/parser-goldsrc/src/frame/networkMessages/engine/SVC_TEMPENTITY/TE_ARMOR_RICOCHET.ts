import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "../../../../Point";
import { coordPoint } from "../SVC_TEMPENTITY";
import { TempEntityType } from "./TempEntityType";

export type TE_ARMOR_RICOCHET = {
  readonly id: TempEntityType.TE_ARMOR_RICOCHET;
  readonly name: "TE_ARMOR_RICOCHET";
  readonly fields: {
    readonly position: Point;
    readonly scale: number;
  };
};

export const armorRicochet: B.BufferParser<TE_ARMOR_RICOCHET> = pipe(
  P.struct({
    position: coordPoint,
    scale: B.uint8_le,
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_ARMOR_RICOCHET,
    name: "TE_ARMOR_RICOCHET",
    fields,
  }))
);
