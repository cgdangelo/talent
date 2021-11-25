import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";

export type StopSound = {
  readonly entityIndex: number;
};

export const stopSound: B.BufferParser<StopSound> = P.struct({
  entityIndex: B.int16_le,
});
