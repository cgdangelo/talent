import type { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";

export type DeltaPacketEntities = never;

export const deltaPacketEntities: B.BufferParser<DeltaPacketEntities> =
  P.fail();
