import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import * as P from '@cgdangelo/talent-parser/lib/Parser';
import { pipe } from 'fp-ts/lib/function';
import { MessageType } from '../MessageType';

export type SendExtraInfo = {
  readonly id: MessageType.SVC_SENDEXTRAINFO;
  readonly name: 'SVC_SENDEXTRAINFO';

  readonly fields: {
    readonly fallbackDir: string;
    readonly canCheat: number;
  };
};

export const sendExtraInfo: B.BufferParser<SendExtraInfo> = pipe(
  P.struct({ fallbackDir: B.ztstr, canCheat: B.uint8 }),

  P.map((fields) => ({
    id: MessageType.SVC_SENDEXTRAINFO,
    name: 'SVC_SENDEXTRAINFO',
    fields
  }))
);
