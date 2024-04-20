import { parser as P } from '@cgdangelo/talent-parser';
import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import { pipe } from 'fp-ts/lib/function';
import { type Point } from '../../../../Point';
import { coordPoint } from './coord';
import { TempEntityType } from './TempEntityType';

export type DLight = {
  readonly id: TempEntityType.TE_DLIGHT;
  readonly name: 'TE_DLIGHT';
  readonly fields: {
    readonly position: Point;
    readonly radius: number;
    readonly color: {
      readonly r: number;
      readonly g: number;
      readonly b: number;
    };
    readonly life: number;
    readonly decayRate: number;
  };
};

export const dLight: B.BufferParser<DLight> = pipe(
  P.struct({
    position: coordPoint,
    radius: B.uint8,
    color: P.struct({
      r: B.uint8,
      g: B.uint8,
      b: B.uint8
    }),
    life: B.uint8,
    decayRate: B.uint8
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_DLIGHT,
    name: 'TE_DLIGHT',
    fields
  }))
);
