import { parser as P } from '@cgdangelo/talent-parser';
import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import { pipe } from 'fp-ts/lib/function';
import type { Point } from '../../../../Point';
import { coordPoint } from './coord';
import { TempEntityType } from './TempEntityType';

export type WorldDecalHigh = {
  readonly id: TempEntityType.TE_WORLDDECALHIGH;
  readonly name: 'TE_WORLDDECALHIGH';
  readonly fields: {
    readonly position: Point;
    readonly decalIndex: number;
  };
};

export const worldDecalHigh: B.BufferParser<WorldDecalHigh> = pipe(
  P.struct({
    position: coordPoint,
    decalIndex: B.uint8
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_WORLDDECALHIGH,
    name: 'TE_WORLDDECALHIGH',
    fields
  }))
);
