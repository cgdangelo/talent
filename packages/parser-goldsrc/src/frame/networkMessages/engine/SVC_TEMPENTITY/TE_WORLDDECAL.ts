import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "../../../../Point";
import { coordPoint } from "../SVC_TEMPENTITY";
import { TempEntityType } from "./TempEntityType";

export type TE_WORLDDECAL = {
  readonly id: TempEntityType.TE_WORLDDECAL;
  readonly name: "TE_WORLDDECAL";
  readonly fields: {
    readonly position: Point;
    readonly textureIndex: number;
  };
};

export const worldDecal: B.BufferParser<TE_WORLDDECAL> = pipe(
  P.struct({
    position: coordPoint,
    textureIndex: B.uint8_le,
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_WORLDDECAL,
    name: "TE_WORLDDECAL",
    fields,
  }))
);
