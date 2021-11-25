import type { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";

export type TempEntity = never;

export const tempEntity: B.BufferParser<TempEntity> = P.fail();
