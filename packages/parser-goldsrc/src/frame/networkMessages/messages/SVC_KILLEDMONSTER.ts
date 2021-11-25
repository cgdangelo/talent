import type { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";

export type KilledMonster = null;

// Deprecated
export const killedMonster: B.BufferParser<KilledMonster> = P.of(null);
