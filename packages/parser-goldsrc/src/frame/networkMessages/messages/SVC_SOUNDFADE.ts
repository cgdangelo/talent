import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";

export type SoundFade = {
  readonly initialPercent: number;
  readonly holdTime: number;
  readonly fadeOutTime: number;
  readonly fadeInTime: number;
};

export const soundFade: B.BufferParser<SoundFade> = P.struct({
  initialPercent: B.uint8_le,
  holdTime: B.uint8_le,
  fadeOutTime: B.uint8_le,
  fadeInTime: B.uint8_le,
});
