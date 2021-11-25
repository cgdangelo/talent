import type { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";

export type PacketEntities = never;

export const packetEntities: B.BufferParser<PacketEntities> = P.fail();
