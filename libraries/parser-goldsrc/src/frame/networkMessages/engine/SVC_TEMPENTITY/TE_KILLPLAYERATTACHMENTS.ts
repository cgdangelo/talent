import { parser as P } from '@cgdangelo/talent-parser';
import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import { pipe } from 'fp-ts/lib/function';
import { TempEntityType } from './TempEntityType';

export type KillPlayerAttachments = {
  readonly id: TempEntityType.TE_KILLPLAYERATTACHMENTS;
  readonly name: 'TE_KILLPLAYERATTACHMENTS';
  readonly fields: {
    readonly entityIndex: number;
  };
};

export const killPlayerAttachments: B.BufferParser<KillPlayerAttachments> = pipe(
  P.struct({ entityIndex: B.uint8 }),

  P.map((fields) => ({
    id: TempEntityType.TE_KILLPLAYERATTACHMENTS,
    name: 'TE_KILLPLAYERATTACHMENTS',
    fields
  }))
);
