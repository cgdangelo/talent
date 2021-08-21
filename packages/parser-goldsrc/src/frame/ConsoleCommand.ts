import { buffer as B } from "@talent/parser-buffer";

export type ConsoleCommand = Buffer;

export const consoleCommand: B.BufferParser<ConsoleCommand> = B.take(64);
