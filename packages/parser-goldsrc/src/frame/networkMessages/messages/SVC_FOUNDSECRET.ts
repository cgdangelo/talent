import type { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";

export type FoundSecret = null;

// Deprecated. Probably old Q2 message?
export const foundSecret: B.BufferParser<FoundSecret> = P.of(null);
