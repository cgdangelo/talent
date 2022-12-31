import { parser as P } from '@cgdangelo/talent-parser';
import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import { pipe } from 'fp-ts/lib/function';
import type { Point } from '../../../../Point';
import { coordPoint } from './coord';
import { TempEntityType } from './TempEntityType';

export type Explosion2 = {
  readonly id: TempEntityType.TE_EXPLOSION2;
  readonly name: 'TE_EXPLOSION2';
  readonly fields: {
    readonly position: Point;
    readonly color: number;
    readonly count: number;
  };
};

export const explosion2: B.BufferParser<Explosion2> = pipe(
  P.struct({
    position: coordPoint,
    color: B.uint8_le,
    count: B.uint8_le
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_EXPLOSION2,
    name: 'TE_EXPLOSION2',
    fields
  }))
);
