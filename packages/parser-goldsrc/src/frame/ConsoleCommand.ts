import type { buffer as B } from "@talent/parser-buffer";
import { take } from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";
import { parser as P } from "parser-ts";

export type ConsoleCommand = Buffer;

export const consoleCommand: B.BufferParser<ConsoleCommand> = pipe(
  take<number>(64),
  P.map((as) => Buffer.from(as))
);
