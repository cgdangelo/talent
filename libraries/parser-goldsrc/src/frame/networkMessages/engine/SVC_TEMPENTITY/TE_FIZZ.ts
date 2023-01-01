import { parser as P } from '@cgdangelo/talent-parser';
import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import { pipe } from 'fp-ts/lib/function';
import { TempEntityType } from './TempEntityType';

export type Fizz = {
  readonly id: TempEntityType.TE_FIZZ;
  readonly name: 'TE_FIZZ';
  readonly fields: {
    readonly entityIndex: number;
    readonly modelIndex: number;
    readonly scale: number;
  };
};

export const fizz: B.BufferParser<Fizz> = pipe(
  P.struct({
    entityIndex: B.int16_le,
    modelIndex: B.int16_le,
    scale: B.uint8
  }),

  P.map((fields) => ({ id: TempEntityType.TE_FIZZ, name: 'TE_FIZZ', fields }))
);
