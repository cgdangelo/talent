import * as BB from '@cgdangelo/talent-parser-bitbuffer';
import type { buffer as B } from '@cgdangelo/talent-parser-buffer';
import * as P from '@cgdangelo/talent-parser/lib/Parser';
import { stream } from '@cgdangelo/talent-parser/lib/Stream';
import { pipe } from 'fp-ts/lib/function';
import { MessageType } from '../MessageType';

export type ResourceList = {
  readonly id: MessageType.SVC_RESOURCELIST;
  readonly name: 'SVC_RESOURCELIST';

  readonly fields: {
    readonly resources: readonly {
      readonly type: number;
      readonly name: string;
      readonly index: number;
      readonly size: number;
      readonly flags: number;
      readonly md5Hash?: number;
      readonly extraInfo?: number;
    }[];

    readonly consistency?: readonly number[];
  };
};

const resource: B.BufferParser<ResourceList['fields']['resources'][number]> = pipe(
  P.struct({
    type: BB.ubits(4),
    name: BB.ztstr,
    index: BB.ubits(12),
    size: BB.ubits(24),
    flags: BB.ubits(3)
  }),

  P.bind('md5Hash', ({ flags }) => ((flags & 4) !== 0 ? BB.ubits(128) : P.of(undefined))),

  P.bind('extraInfo', () => BB.bitFlagged(() => BB.ubits(256)))
);

const consistency: B.BufferParser<readonly number[]> = pipe(
  P.many(
    pipe(
      BB.ubits(1),
      P.filter((hasCheckfileFlag) => hasCheckfileFlag !== 0),
      P.apSecond(BB.ubits(1)),
      P.chain((isShortIndex) => BB.ubits(isShortIndex ? 5 : 10))
    )
  ),

  P.apFirst(P.skip(1))
);

export const resourceList: B.BufferParser<ResourceList> = (i) =>
  pipe(
    stream(i.buffer, i.cursor * 8),

    pipe(
      BB.ubits(12),
      P.chain((entryCount) => P.manyN(resource, entryCount)),
      P.bindTo('resources'),

      P.bind('consistency', () => BB.bitFlagged(() => consistency)),

      BB.nextByte,

      P.map((fields) => ({
        id: MessageType.SVC_RESOURCELIST,
        name: 'SVC_RESOURCELIST',
        fields
      }))
    )
  );
