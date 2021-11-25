import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";

export type SetView = {
  readonly entityIndex: number;
};

export const setView: B.BufferParser<SetView> = P.struct({
  entityIndex: B.int16_le,
});
