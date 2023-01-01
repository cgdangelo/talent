import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import * as P from '@cgdangelo/talent-parser/lib/Parser';
import { pipe } from 'fp-ts/lib/function';
import { MessageType } from '../MessageType';

export type SoundFade = {
  readonly id: MessageType.SVC_SOUNDFADE;
  readonly name: 'SVC_SOUNDFADE';

  readonly fields: {
    readonly initialPercent: number;
    readonly holdTime: number;
    readonly fadeOutTime: number;
    readonly fadeInTime: number;
  };
};

export const soundFade: B.BufferParser<SoundFade> = pipe(
  P.struct({
    initialPercent: B.uint8,
    holdTime: B.uint8,
    fadeOutTime: B.uint8,
    fadeInTime: B.uint8
  }),

  P.map((fields) => ({
    id: MessageType.SVC_SOUNDFADE,
    name: 'SVC_SOUNDFADE',
    fields
  }))
);
