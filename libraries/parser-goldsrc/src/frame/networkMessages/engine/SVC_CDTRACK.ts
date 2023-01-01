import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import * as P from '@cgdangelo/talent-parser/lib/Parser';
import { pipe } from 'fp-ts/lib/function';
import { MessageType } from '../MessageType';

export type CDTrack = {
  readonly id: MessageType.SVC_CDTRACK;
  readonly name: 'SVC_CDTRACK';

  readonly fields: {
    readonly track: number;
    readonly loopTrack: number;
  };
};

export const cdTrack: B.BufferParser<CDTrack> = pipe(
  P.struct({ track: B.int8, loopTrack: B.int8 }),

  P.map((fields) => ({
    id: MessageType.SVC_CDTRACK,
    name: 'SVC_CDTRACK',
    fields
  }))
);
