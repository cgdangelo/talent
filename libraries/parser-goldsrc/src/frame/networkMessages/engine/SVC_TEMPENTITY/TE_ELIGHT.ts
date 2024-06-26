import { parser as P } from '@cgdangelo/talent-parser';
import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import { pipe } from 'fp-ts/lib/function';
import { type Point } from '../../../../Point';
import { coord, coordPoint } from './coord';
import { TempEntityType } from './TempEntityType';

export type ELight = {
  readonly id: TempEntityType.TE_ELIGHT;
  readonly name: 'TE_ELIGHT';
  readonly fields: {
    readonly entityIndex: number;
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

export const eLight: B.BufferParser<ELight> = pipe(
  P.struct({
    entityIndex: B.int16_le,
    position: coordPoint,
    radius: coord,
    color: P.struct({
      r: B.uint8,
      g: B.uint8,
      b: B.uint8
    }),
    life: B.uint8
  }),

  P.bind('decayRate', () =>
    pipe(
      B.int16_le
      // P.map((a) => (life !== 0 ? a / life : a))
    )
  ),

  P.map((fields) => ({
    id: TempEntityType.TE_ELIGHT,
    name: 'TE_ELIGHT',
    fields
  }))
);
