import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";

export type CDTrack = {
  readonly track: number;
  readonly loopTrack: number;
};

export const cdTrack: B.BufferParser<CDTrack> = P.struct({
  track: B.int8_le,
  loopTrack: B.int8_le,
});
