import type { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";

export type Event = unknown;

export const event: B.BufferParser<Event> = P.fail();
