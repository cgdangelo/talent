import { parser as P } from '@cgdangelo/talent-parser';
import { type buffer as B } from '@cgdangelo/talent-parser-buffer';
import { pipe } from 'fp-ts/lib/function';
import { type Point } from '../../../../Point';
import { coordPoint } from './coord';
import { TempEntityType } from './TempEntityType';

export type Sparks = {
  readonly id: TempEntityType.TE_SPARKS;
  readonly name: 'TE_SPARKS';
  readonly fields: {
    readonly position: Point;
  };
};

export const sparks: B.BufferParser<Sparks> = pipe(
  P.struct({ position: coordPoint }),

  P.map((fields) => ({
    id: TempEntityType.TE_SPARKS,
    name: 'TE_SPARKS',
    fields
  }))
);
