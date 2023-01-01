import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import * as P from '@cgdangelo/talent-parser/lib/Parser';
import { pipe } from 'fp-ts/lib/function';
import { MessageType } from '../MessageType';

export type Customization = {
  readonly id: MessageType.SVC_CUSTOMIZATION;
  readonly name: 'SVC_CUSTOMIZATION';

  readonly fields: {
    readonly playerIndex: number;
    readonly type: number;
    readonly name: string;
    readonly index: number;
    readonly downloadSize: number;
    readonly flags: number;
    readonly md5Hash?: readonly number[]; // TODO map to string
  };
};

export const customization: B.BufferParser<Customization> = pipe(
  P.struct({
    playerIndex: B.uint8,
    type: B.uint8,
    name: B.ztstr,
    index: B.uint16_le,
    downloadSize: B.uint32_le,
    flags: B.uint8
  }),

  P.bind('md5Hash', ({ flags }) => ((flags & 4) !== 0 ? P.take(16) : P.of(undefined))),

  P.map((fields) => ({
    id: MessageType.SVC_CUSTOMIZATION,
    name: 'SVC_CUSTOMIZATION',
    fields
  }))
);
