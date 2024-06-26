import { parser as P } from '@cgdangelo/talent-parser';
import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import { pipe } from 'fp-ts/lib/function';
import { type Point } from '../../../../Point';
import { coordPoint } from './coord';
import { TempEntityType } from './TempEntityType';

export type Projectile = {
  readonly id: TempEntityType.TE_PROJECTILE;
  readonly name: 'TE_PROJECTILE';
  readonly fields: {
    readonly position: Point;
    readonly velocity: Point;
    readonly modelIndex: number;
    readonly life: number;
    readonly color: number;
  };
};

export const projectile: B.BufferParser<Projectile> = pipe(
  P.struct({
    position: coordPoint,
    velocity: coordPoint,
    modelIndex: B.int16_le,
    life: B.uint8,
    color: B.uint8
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_PROJECTILE,
    name: 'TE_PROJECTILE',
    fields
  }))
);
