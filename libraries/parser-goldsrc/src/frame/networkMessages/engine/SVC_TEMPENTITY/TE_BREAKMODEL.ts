import { parser as P } from '@cgdangelo/talent-parser';
import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import { pipe } from 'fp-ts/lib/function';
import { type Point } from '../../../../Point';
import { coordPoint } from './coord';
import { TempEntityType } from './TempEntityType';

export type BreakModel = {
  readonly id: TempEntityType.TE_BREAKMODEL;
  readonly name: 'TE_BREAKMODEL';
  readonly fields: {
    readonly position: Point;
    readonly size: Point;
    readonly velocity: Point;
    readonly velocityRandomness: number;
    readonly objectIndex: number;
    readonly count: number;
    readonly life: number;
    readonly flags: number;
  };
};

export const breakModel: B.BufferParser<BreakModel> = pipe(
  P.struct({
    position: coordPoint,
    size: coordPoint,
    velocity: coordPoint,
    velocityRandomness: B.uint8,
    objectIndex: B.int16_le,
    count: B.uint8,
    life: B.uint8,
    flags: B.uint8
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_BREAKMODEL,
    name: 'TE_BREAKMODEL',
    fields
  }))
);
