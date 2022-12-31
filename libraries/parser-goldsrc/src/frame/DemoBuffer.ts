import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import * as P from '@cgdangelo/talent-parser/lib/Parser';
import { pipe } from 'fp-ts/lib/function';
import type { FrameHeader } from './FrameHeader';
import { frameHeader } from './FrameHeader';

export type DemoBuffer = {
  readonly header: FrameHeader;
  readonly type: 'DemoBuffer';
  readonly frameData: Buffer;
};

export const demoBuffer: B.BufferParser<DemoBuffer> = pipe(
  frameHeader,
  P.bindTo('header'),

  P.bind('type', () => P.of('DemoBuffer' as const)),

  P.bind('frameData', () =>
    pipe(
      B.uint32_le,
      P.chain((n) => P.take(n)),
      P.map((as) => Buffer.from(as))
    )
  )
);
