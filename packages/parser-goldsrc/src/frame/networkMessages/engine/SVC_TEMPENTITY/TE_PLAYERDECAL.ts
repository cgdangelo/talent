import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "../../../../Point";
import { coordPoint } from "../SVC_TEMPENTITY";
import { TempEntityType } from "./TempEntityType";

export type PlayerDecal = {
  readonly id: TempEntityType.TE_PLAYERDECAL;
  readonly name: "TE_PLAYERDECAL";
  readonly fields: {
    readonly playerIndex: number;
    readonly position: Point;
    readonly entityIndex: number;
    readonly decalIndex: number;
  };
};

export const playerDecal: B.BufferParser<PlayerDecal> = pipe(
  P.struct({
    playerIndex: B.uint8_le,
    position: coordPoint,
    entityIndex: B.int16_le,
    decalIndex: B.uint8_le,
    // [optional] short (model index???)
    // modelIndex: B.int16_le,
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_PLAYERDECAL,
    name: "TE_PLAYERDECAL",
    fields,
  }))
);
