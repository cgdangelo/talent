import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import { TempEntityType } from "./TempEntityType";

export type TE_KILLPLAYERATTACHMENTS = {
  readonly id: TempEntityType.TE_KILLPLAYERATTACHMENTS;
  readonly name: "TE_KILLPLAYERATTACHMENTS";
  readonly fields: {
    readonly entityIndex: number;
  };
};

export const killPlayerAttachments: B.BufferParser<TE_KILLPLAYERATTACHMENTS> =
  pipe(
    P.struct({ entityIndex: B.uint8_le }),

    P.map((fields) => ({
      id: TempEntityType.TE_KILLPLAYERATTACHMENTS,
      name: "TE_KILLPLAYERATTACHMENTS",
      fields,
    }))
  );
