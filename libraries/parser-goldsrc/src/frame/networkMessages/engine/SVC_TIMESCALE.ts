import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import * as P from '@cgdangelo/talent-parser/lib/Parser';
import { pipe } from 'fp-ts/lib/function';
import { MessageType } from '../MessageType';

export type TimeScale = {
  readonly id: MessageType.SVC_TIMESCALE;
  readonly name: 'SVC_TIMESCALE';

  readonly fields: {
    readonly timeScale: number;
  };
};

export const timeScale: B.BufferParser<TimeScale> = pipe(
  P.struct({ timeScale: B.float32_le }),

  P.map((fields) => ({
    id: MessageType.SVC_TIMESCALE,
    name: 'SVC_TIMESCALE',
    fields
  }))
);
