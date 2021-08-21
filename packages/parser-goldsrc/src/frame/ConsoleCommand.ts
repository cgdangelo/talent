import { buffer as B } from "@talent/parser-buffer";
import { parser as P } from "@talent/parser";
import { pipe } from "fp-ts/lib/function";

export type ConsoleCommand = {
  readonly command: Buffer;
};

export const consoleCommand: B.BufferParser<ConsoleCommand> = pipe(
  B.take(64),
  P.map((command) => ({ command }))
);
