import { parser as P } from '@cgdangelo/talent-parser';
import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import { pipe } from 'fp-ts/lib/function';
import { coord } from './coord';
import { TempEntityType } from './TempEntityType';

export type PlayerAttachment = {
  readonly id: TempEntityType.TE_PLAYERATTACHMENT;
  readonly name: 'TE_PLAYERATTACHMENT';
  readonly fields: {
    readonly entityIndex: number;
    readonly scale: number;
    readonly modelIndex: number;
    readonly life: number;
  };
};

export const playerAttachment: B.BufferParser<PlayerAttachment> = pipe(
  P.struct({
    entityIndex: B.uint8_le,
    scale: coord,
    modelIndex: B.int16_le,
    life: B.int16_le
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_PLAYERATTACHMENT,
    name: 'TE_PLAYERATTACHMENT',
    fields
  }))
);
