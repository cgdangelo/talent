import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";

export type SendCvarValue = {
  readonly name: string;
};

// Deprecated
export const sendCvarValue: B.BufferParser<SendCvarValue> = P.struct({
  name: B.ztstr,
});
