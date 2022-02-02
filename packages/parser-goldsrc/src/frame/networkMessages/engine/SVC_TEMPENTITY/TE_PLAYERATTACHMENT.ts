import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import { coord } from "../SVC_TEMPENTITY";
import { TempEntityType } from "./TempEntityType";

export type TE_PLAYERATTACHMENT = {
  readonly id: TempEntityType.TE_PLAYERATTACHMENT;
  readonly name: "TE_PLAYERATTACHMENT";
  readonly fields: {
    readonly entityIndex: number;
    readonly scale: number;
    readonly modelIndex: number;
    readonly life: number;
  };
};

export const playerAttachment: B.BufferParser<TE_PLAYERATTACHMENT> = pipe(
  P.struct({
    entityIndex: B.uint8_le,
    scale: coord,
    modelIndex: B.int16_le,
    life: B.int16_le,
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_PLAYERATTACHMENT,
    name: "TE_PLAYERATTACHMENT",
    fields,
  }))
);
