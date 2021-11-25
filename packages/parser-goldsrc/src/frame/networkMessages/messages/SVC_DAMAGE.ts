import type { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";

export type Damage = null;

// Deprecated
export const damage: B.BufferParser<Damage> = P.of(null);
