import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";
import { MessageType } from "../MessageType";

export type VoiceData = {
  readonly id: MessageType.SVC_VOICEDATA;
  readonly name: "SVC_VOICEDATA";

  readonly fields: {
    readonly playerIndex: number;
    readonly size: number;
    readonly data: readonly number[];
  };
};

export const voiceData: B.BufferParser<VoiceData> = pipe(
  P.struct({ playerIndex: B.uint8_le, size: B.uint16_le }),

  P.bind("data", ({ size }) => P.take<number>(size)),

  P.map((fields) => ({
    id: MessageType.SVC_VOICEDATA,
    name: "SVC_VOICEDATA",
    fields,
  }))
);
