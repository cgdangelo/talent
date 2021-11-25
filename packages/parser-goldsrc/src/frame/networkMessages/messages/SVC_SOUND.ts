import type { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";

export type Sound = never;

export const sound: B.BufferParser<Sound> = P.fail();
