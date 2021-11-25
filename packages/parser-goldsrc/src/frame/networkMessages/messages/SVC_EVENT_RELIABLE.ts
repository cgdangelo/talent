import type { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";

export type EventReliable = never;

export const eventReliable: B.BufferParser<EventReliable> = P.fail();
