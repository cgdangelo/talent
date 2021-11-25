import type { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";

export type Choke = null;

export const choke: B.BufferParser<Choke> = P.of(null);
