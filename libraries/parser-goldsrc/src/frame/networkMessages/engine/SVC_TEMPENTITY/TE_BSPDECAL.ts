import { parser as P } from '@cgdangelo/talent-parser';
import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import { pipe } from 'fp-ts/lib/function';
import type { Point } from '../../../../Point';
import { coordPoint } from './coord';
import { TempEntityType } from './TempEntityType';

export type BSPDecal = {
  readonly id: TempEntityType.TE_BSPDECAL;
  readonly name: 'TE_BSPDECAL';
  readonly fields: {
    readonly position: Point;
    readonly decalIndex: number;
    readonly entityIndex: number;
    readonly modelIndex?: number;
  };
};

export const bspDecal: B.BufferParser<BSPDecal> = pipe(
  P.struct({
    position: coordPoint,
    decalIndex: B.int16_le,
    entityIndex: B.int16_le
  }),

  P.bind('modelIndex', ({ entityIndex }) => (entityIndex !== 0 ? B.int16_le : P.of(undefined))),

  P.map((fields) => ({
    id: TempEntityType.TE_BSPDECAL,
    name: 'TE_BSPDECAL',
    fields
  }))
);
