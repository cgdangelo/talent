import { parser as P } from '@cgdangelo/talent-parser';
import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import { pipe } from 'fp-ts/lib/function';
import type { Point } from '../../../../Point';
import { coordPoint } from './coord';
import { TempEntityType } from './TempEntityType';

export type DecalHigh = {
  readonly id: TempEntityType.TE_DECALHIGH;
  readonly name: 'TE_DECALHIGH';
  readonly fields: {
    readonly position: Point;
    readonly decalIndex: number;
    readonly entityIndex: number;
  };
};

export const decalHigh: B.BufferParser<DecalHigh> = pipe(
  P.struct({
    position: coordPoint,
    decalIndex: B.uint8,
    entityIndex: B.int16_le
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_DECALHIGH,
    name: 'TE_DECALHIGH',
    fields
  }))
);
