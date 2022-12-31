import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import * as P from '@cgdangelo/talent-parser/lib/Parser';
import { pipe } from 'fp-ts/lib/function';
import { MessageType } from '../MessageType';

export type Disconnect = {
  readonly id: MessageType.SVC_DISCONNECT;
  readonly name: 'SVC_DISCONNECT';

  readonly fields: {
    readonly reason: string;
  };
};

export const disconnect: B.BufferParser<Disconnect> = pipe(
  P.struct({ reason: B.ztstr }),

  P.map((fields) => ({
    id: MessageType.SVC_DISCONNECT,
    name: 'SVC_DISCONNECT',
    fields
  }))
);
