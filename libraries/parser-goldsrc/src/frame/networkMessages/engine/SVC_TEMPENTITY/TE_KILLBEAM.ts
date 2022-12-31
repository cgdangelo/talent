import { parser as P } from '@cgdangelo/talent-parser';
import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import { pipe } from 'fp-ts/lib/function';
import { TempEntityType } from './TempEntityType';

export type KillBeam = {
  readonly id: TempEntityType.TE_KILLBEAM;
  readonly name: 'TE_KILLBEAM';
  readonly fields: {
    readonly entityIndex: number;
  };
};

export const killBeam: B.BufferParser<KillBeam> = pipe(
  P.struct({ entityIndex: B.int16_le }),

  P.map((fields) => ({
    id: TempEntityType.TE_KILLBEAM,
    name: 'TE_KILLBEAM',
    fields
  }))
);
