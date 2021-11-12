import { buffer as B } from "@talent/parser-buffer";

export type ConsoleCommand = string;

export const consoleCommand: B.BufferParser<ConsoleCommand> =
  B.ztstr_padded(64);
