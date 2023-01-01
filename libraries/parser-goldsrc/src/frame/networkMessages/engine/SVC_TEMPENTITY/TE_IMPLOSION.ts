import { parser as P } from '@cgdangelo/talent-parser';
import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import { pipe } from 'fp-ts/lib/function';
import type { Point } from '../../../../Point';
import { coordPoint } from './coord';
import { TempEntityType } from './TempEntityType';

export type Implosion = {
  readonly id: TempEntityType.TE_IMPLOSION;
  readonly name: 'TE_IMPLOSION';
  readonly fields: {
    readonly position: Point;
    readonly radius: number;
    readonly count: number;
    readonly life: number;
  };
};

export const implosion: B.BufferParser<Implosion> = pipe(
  P.struct({
    position: coordPoint,
    radius: B.uint8,
    count: B.uint8,
    life: B.uint8
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_IMPLOSION,
    name: 'TE_IMPLOSION',
    fields
  }))
);
