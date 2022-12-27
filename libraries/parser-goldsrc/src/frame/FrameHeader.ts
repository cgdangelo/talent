import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";

export type FrameHeader = {
  readonly time: number;
  readonly frame: number;
};

export const frameHeader: B.BufferParser<FrameHeader> = P.struct({
  time: B.float32_le,
  frame: B.uint32_le,
});
