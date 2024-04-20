import { parser as P } from '@cgdangelo/talent-parser';
import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import { pipe } from 'fp-ts/lib/function';
import { type Point } from '../../../../Point';
import { coordPoint } from './coord';
import { TempEntityType } from './TempEntityType';

export type Decal = {
  readonly id: TempEntityType.TE_DECAL;
  readonly name: 'TE_DECAL';
  readonly fields: {
    readonly position: Point;
    readonly decalIndex: number;
    readonly entityIndex: number;
  };
};

export const decal: B.BufferParser<Decal> = pipe(
  P.struct({
    position: coordPoint,
    decalIndex: B.uint8,
    entityIndex: B.int16_le
  }),

  P.map((fields) => ({ id: TempEntityType.TE_DECAL, name: 'TE_DECAL', fields }))
);
