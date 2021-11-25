import type { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";

export type ClientData = never;

export const clientData: B.BufferParser<ClientData> = P.fail();
