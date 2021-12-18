import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";

export type VoiceData = {
  readonly playerIndex: number;
  readonly size: number;
  readonly data: readonly number[];
};

export const voiceData: B.BufferParser<VoiceData> = pipe(
  P.struct({ playerIndex: B.uint8_le, size: B.uint16_le }),
  P.bind("data", ({ size }) => pipe(P.manyN(B.uint8_le, size)))
);
