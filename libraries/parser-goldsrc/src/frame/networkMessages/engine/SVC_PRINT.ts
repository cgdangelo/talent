import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import * as P from '@cgdangelo/talent-parser/lib/Parser';
import { pipe } from 'fp-ts/lib/function';
import { MessageType } from '../MessageType';

export type Print = {
  readonly id: MessageType.SVC_PRINT;
  readonly name: 'SVC_PRINT';

  readonly fields: {
    readonly message: string;
  };
};

export const print: B.BufferParser<Print> = pipe(
  P.struct({ message: B.ztstr }),

  P.map((fields) => ({
    id: MessageType.SVC_PRINT,
    name: 'SVC_PRINT',
    fields
  }))
);
