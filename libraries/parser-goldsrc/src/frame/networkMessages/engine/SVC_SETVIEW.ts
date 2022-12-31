import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import * as P from '@cgdangelo/talent-parser/lib/Parser';
import { pipe } from 'fp-ts/lib/function';
import { MessageType } from '../MessageType';

export type SetView = {
  readonly id: MessageType.SVC_SETVIEW;
  readonly name: 'SVC_SETVIEW';

  readonly fields: {
    readonly entityIndex: number;
  };
};

export const setView: B.BufferParser<SetView> = pipe(
  P.struct({ entityIndex: B.int16_le }),

  P.map((fields) => ({
    id: MessageType.SVC_SETVIEW,
    name: 'SVC_SETVIEW',
    fields
  }))
);
