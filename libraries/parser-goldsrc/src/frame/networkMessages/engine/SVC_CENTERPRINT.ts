import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import * as P from '@cgdangelo/talent-parser/lib/Parser';
import { pipe } from 'fp-ts/lib/function';
import { MessageType } from '../MessageType';

export type CenterPrint = {
  readonly id: MessageType.SVC_CENTERPRINT;
  readonly name: 'SVC_CENTERPRINT';

  readonly fields: {
    readonly message: string;
  };
};

export const centerPrint: B.BufferParser<CenterPrint> = pipe(
  P.struct({ message: B.ztstr }),

  P.map((fields) => ({
    id: MessageType.SVC_CENTERPRINT,
    name: 'SVC_CENTERPRINT',
    fields
  }))
);
