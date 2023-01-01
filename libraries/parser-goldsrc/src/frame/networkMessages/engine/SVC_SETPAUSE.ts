import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import * as P from '@cgdangelo/talent-parser/lib/Parser';
import { pipe } from 'fp-ts/lib/function';
import { MessageType } from '../MessageType';

export type SetPause = {
  readonly id: MessageType.SVC_SETPAUSE;
  readonly name: 'SVC_SETPAUSE';

  readonly fields: {
    readonly isPaused: number;
  };
};

export const setPause: B.BufferParser<SetPause> = pipe(
  P.struct({ isPaused: B.int8 }),

  P.map((fields) => ({
    id: MessageType.SVC_SETPAUSE,
    name: 'SVC_SETPAUSE',
    fields
  }))
);
