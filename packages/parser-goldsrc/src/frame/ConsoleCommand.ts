import type { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import * as P from "@talent/parser/lib/Parser";

export type ConsoleCommand = Buffer;

export const consoleCommand: B.BufferParser<ConsoleCommand> = pipe(
  P.take<number>(64),
  P.map((as) => Buffer.from(as))
);
