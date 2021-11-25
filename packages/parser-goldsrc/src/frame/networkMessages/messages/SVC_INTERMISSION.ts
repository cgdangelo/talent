import type { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";

export type Intermission = null;

export const intermission: B.BufferParser<Intermission> = P.of(null);
