import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";

export type VoiceInit = {
  readonly codecName: string;
  readonly quality: number;
};

export const voiceInit: B.BufferParser<VoiceInit> = P.struct({
  codecName: B.ztstr,
  quality: B.int8_le,
});
