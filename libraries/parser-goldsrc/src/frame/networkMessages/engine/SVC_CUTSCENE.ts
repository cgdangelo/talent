import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import * as P from '@cgdangelo/talent-parser/lib/Parser';
import { pipe } from 'fp-ts/lib/function';
import { MessageType } from '../MessageType';

export type Cutscene = {
  readonly id: MessageType.SVC_CUTSCENE;
  readonly name: 'SVC_CUTSCENE';

  readonly fields: {
    readonly text: string;
  };
};

export const cutscene: B.BufferParser<Cutscene> = pipe(
  P.struct({ text: B.ztstr }),

  P.map((fields) => ({
    id: MessageType.SVC_CUTSCENE,
    name: 'SVC_CUTSCENE',
    fields
  }))
);
