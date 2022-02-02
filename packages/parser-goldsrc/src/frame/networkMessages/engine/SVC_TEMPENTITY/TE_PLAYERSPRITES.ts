import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import { TempEntityType } from "./TempEntityType";

export type TE_PLAYERSPRITES = {
  readonly id: TempEntityType.TE_PLAYERSPRITES;
  readonly name: "TE_PLAYERSPRITES";
  readonly fields: {
    readonly entityIndex: number;
    readonly modelIndex: number;
    readonly count: number;
    readonly variance: number;
  };
};

export const playerSprites: B.BufferParser<TE_PLAYERSPRITES> = pipe(
  P.struct({
    entityIndex: B.int16_le,
    modelIndex: B.int16_le,
    count: B.uint8_le,
    variance: B.uint8_le,
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_PLAYERSPRITES,
    name: "TE_PLAYERSPRITES",
    fields,
  }))
);
