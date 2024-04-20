import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import * as P from '@cgdangelo/talent-parser/lib/Parser';
import { pipe } from 'fp-ts/lib/function';
import { type FrameHeader } from './FrameHeader';
import { frameHeader } from './FrameHeader';

export type Sound = {
  readonly header: FrameHeader;
  readonly type: 'Sound';
  readonly frameData: {
    readonly channel: number;
    readonly sample: string;
    readonly attenuation: number;
    readonly volume: number;
    readonly flags: number;
    readonly pitch: number;
  };
};

export const sound: B.BufferParser<Sound> = pipe(
  frameHeader,
  P.bindTo('header'),

  P.bind('type', () => P.of('Sound' as const)),

  P.bind('frameData', () =>
    P.struct({
      channel: B.int32_le,
      sample: pipe(
        B.uint32_le,
        P.chain(B.ztstr_padded) // TODO Is this actually correct?
      ),
      attenuation: B.float32_le,
      volume: B.float32_le,
      flags: B.int32_le,
      pitch: B.int32_le
    })
  )
);
