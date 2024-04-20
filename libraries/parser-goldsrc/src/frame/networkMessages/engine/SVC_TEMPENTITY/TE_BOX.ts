import { parser as P } from '@cgdangelo/talent-parser';
import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import { pipe } from 'fp-ts/lib/function';
import { type Point } from '../../../../Point';
import { coordPoint } from './coord';
import { TempEntityType } from './TempEntityType';

export type Box = {
  readonly id: TempEntityType.TE_BOX;
  readonly name: 'TE_BOX';
  readonly fields: {
    readonly startPosition: Point;
    readonly endPosition: Point;
    readonly life: number;
    readonly color: {
      readonly r: number;
      readonly g: number;
      readonly b: number;
    };
  };
};

export const box: B.BufferParser<Box> = pipe(
  P.struct({
    startPosition: coordPoint,
    endPosition: coordPoint,
    life: B.int16_le,
    color: P.struct({
      r: B.uint8,
      g: B.uint8,
      b: B.uint8
    })
  }),

  P.map((fields) => ({ id: TempEntityType.TE_BOX, name: 'TE_BOX', fields }))
);
