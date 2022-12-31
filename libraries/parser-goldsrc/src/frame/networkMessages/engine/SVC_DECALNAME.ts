import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import * as P from '@cgdangelo/talent-parser/lib/Parser';
import { pipe } from 'fp-ts/lib/function';
import { MessageType } from '../MessageType';

export type DecalName = {
  readonly id: MessageType.SVC_DECALNAME;
  readonly name: 'SVC_DECALNAME';

  readonly fields: {
    readonly positionIndex: number;
    readonly decalName: string;
  };
};

export const decalName: B.BufferParser<DecalName> = pipe(
  P.struct({ positionIndex: B.uint8_le, decalName: B.ztstr }),

  P.map((fields) => ({
    id: MessageType.SVC_DECALNAME,
    name: 'SVC_DECALNAME',
    fields
  }))
);
