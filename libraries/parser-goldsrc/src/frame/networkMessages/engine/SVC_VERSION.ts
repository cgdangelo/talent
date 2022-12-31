import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import * as P from '@cgdangelo/talent-parser/lib/Parser';
import { pipe } from 'fp-ts/lib/function';
import { MessageType } from '../MessageType';

export type Version = {
  readonly id: MessageType.SVC_VERSION;
  readonly name: 'SVC_VERSION';

  readonly fields: {
    readonly protocolVersion: number;
  };
};

export const version: B.BufferParser<Version> = pipe(
  P.struct({ protocolVersion: B.uint32_le }),

  P.map((fields) => ({
    id: MessageType.SVC_VERSION,
    name: 'SVC_VERSION',
    fields
  }))
);
