import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import * as P from '@cgdangelo/talent-parser/lib/Parser';
import { pipe } from 'fp-ts/lib/function';
import { MessageType } from '../MessageType';

export type VoiceInit = {
  readonly id: MessageType.SVC_VOICEINIT;
  readonly name: 'SVC_VOICEINIT';

  readonly fields: {
    readonly codecName: string;
    readonly quality: number;
  };
};

export const voiceInit: B.BufferParser<VoiceInit> = pipe(
  P.struct({ codecName: B.ztstr, quality: B.int8 }),

  P.map((fields) => ({
    id: MessageType.SVC_VOICEINIT,
    name: 'SVC_VOICEINIT',
    fields
  }))
);
