import { parser as P } from '@cgdangelo/talent-parser';
import { buffer as B } from '@cgdangelo/talent-parser-buffer';

export type FrameHeader = {
  readonly time: number;
  readonly frame: number;
};

export const frameHeader: B.BufferParser<FrameHeader> = P.struct({
  time: B.float32_le,
  frame: B.uint32_le
});
