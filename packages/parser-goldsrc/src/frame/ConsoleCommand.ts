import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import type { FrameHeader } from "./FrameHeader";
import { frameHeader } from "./FrameHeader";

export type ConsoleCommand = {
  readonly header: FrameHeader;
  readonly type: "ConsoleCommand";
  readonly frameData: string;
};

export const consoleCommand: B.BufferParser<ConsoleCommand> = pipe(
  frameHeader,
  P.bindTo("header"),

  P.bind("type", () => P.of("ConsoleCommand" as const)),

  P.bind("frameData", () => B.ztstr_padded(64))
);
