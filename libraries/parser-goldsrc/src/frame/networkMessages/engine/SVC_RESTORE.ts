import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import * as P from '@cgdangelo/talent-parser/lib/Parser';
import { pipe } from 'fp-ts/lib/function';
import { MessageType } from '../MessageType';

export type Restore = {
  readonly id: MessageType.SVC_RESTORE;
  readonly name: 'SVC_RESTORE';

  readonly fields: {
    readonly saveName: string;
    readonly mapCount: number;
    readonly mapNames: readonly string[];
  };
};

export const restore: B.BufferParser<Restore> = pipe(
  P.struct({ saveName: B.ztstr, mapCount: B.uint8 }),
  P.bind('mapNames', ({ mapCount }) => P.manyN(B.ztstr, mapCount)),

  P.map((fields) => ({
    id: MessageType.SVC_RESTORE,
    name: 'SVC_RESTORE',
    fields
  }))
);
