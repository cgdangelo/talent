import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";
import { MessageType } from "../MessageType";

export type CDTrack = {
  readonly type: {
    readonly id: MessageType.SVC_CDTRACK;
    readonly name: "SVC_CDTRACK";
  };

  readonly fields: {
    readonly track: number;
    readonly loopTrack: number;
  };
};

export const cdTrack: B.BufferParser<CDTrack> = pipe(
  P.struct({ track: B.int8_le, loopTrack: B.int8_le }),

  P.map((fields) => ({
    type: { id: MessageType.SVC_CDTRACK, name: "SVC_CDTRACK" } as const,
    fields,
  }))
);
