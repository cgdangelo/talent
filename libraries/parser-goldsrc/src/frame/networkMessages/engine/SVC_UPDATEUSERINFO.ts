import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import * as P from '@cgdangelo/talent-parser/lib/Parser';
import { readonlyArray as RA, readonlyNonEmptyArray as RNEA, string as S } from 'fp-ts';
import { flow, pipe } from 'fp-ts/lib/function';
import { MessageType } from '../MessageType';

export type UpdateUserInfo = {
  readonly id: MessageType.SVC_UPDATEUSERINFO;
  readonly name: 'SVC_UPDATEUSERINFO';

  readonly fields: {
    readonly clientIndex: number;
    readonly clientUserId: number;
    readonly clientUserInfo: Record<string, string>;
    readonly clientCdKeyHash: readonly number[];
  };
};

export const updateUserInfo: B.BufferParser<UpdateUserInfo> = pipe(
  P.struct({
    clientIndex: B.uint8,
    clientUserId: B.uint32_le,
    clientUserInfo: pipe(B.ztstr, P.map(flow(S.split('\\'), RNEA.tail, RA.chunksOf(2), Object.fromEntries))),
    clientCdKeyHash: P.take(16)
  }),

  P.map((fields) => ({
    id: MessageType.SVC_UPDATEUSERINFO,
    name: 'SVC_UPDATEUSERINFO',
    fields
  }))
);
