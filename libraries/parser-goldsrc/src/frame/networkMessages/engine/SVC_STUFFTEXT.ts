import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import * as P from '@cgdangelo/talent-parser/lib/Parser';
import { pipe } from 'fp-ts/lib/function';
import { MessageType } from '../MessageType';

export type StuffText = {
  readonly id: MessageType.SVC_STUFFTEXT;
  readonly name: 'SVC_STUFFTEXT';

  readonly fields: {
    readonly command: string;
  };
};

export const stuffText: B.BufferParser<StuffText> = pipe(
  P.struct({ command: B.ztstr }),

  P.map((fields) => ({
    id: MessageType.SVC_STUFFTEXT,
    name: 'SVC_STUFFTEXT',
    fields
  }))
);
