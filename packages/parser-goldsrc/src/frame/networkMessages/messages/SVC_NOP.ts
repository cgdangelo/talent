import type { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";

export type Nop = null;

export const nop: B.BufferParser<Nop> = P.of(null);
