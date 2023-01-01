import { parser as P } from '@cgdangelo/talent-parser';
import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import { pipe } from 'fp-ts/lib/function';
import type { Point } from '../../../../Point';
import { coord, coordPoint } from './coord';
import { TempEntityType } from './TempEntityType';

export type ExplodeModel = {
  readonly id: TempEntityType.TE_EXPLODEMODEL;
  readonly name: 'TE_EXPLODEMODEL';
  readonly fields: {
    readonly position: Point;
    readonly velocity: number;
    readonly modelIndex: number;
    readonly count: number;
    readonly life: number;
  };
};

export const explodeModel: B.BufferParser<ExplodeModel> = pipe(
  P.struct({
    position: coordPoint,
    velocity: coord,
    modelIndex: B.int16_le,
    count: B.int16_le,
    life: B.uint8
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_EXPLODEMODEL,
    name: 'TE_EXPLODEMODEL',
    fields
  }))
);
