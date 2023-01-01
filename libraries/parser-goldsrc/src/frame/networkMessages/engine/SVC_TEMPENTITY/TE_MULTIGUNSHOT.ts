import { parser as P } from '@cgdangelo/talent-parser';
import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import { pipe } from 'fp-ts/lib/function';
import type { Point } from '../../../../Point';
import { coord, coordPoint } from './coord';
import { TempEntityType } from './TempEntityType';

export type MultiGunshot = {
  readonly id: TempEntityType.TE_MULTIGUNSHOT;
  readonly name: 'TE_MULTIGUNSHOT';
  readonly fields: {
    readonly origin: Point;
    readonly direction: Point;
    readonly noise: Point;
  };
};

export const multiGunshot: B.BufferParser<MultiGunshot> = pipe(
  P.struct({
    origin: coordPoint,
    direction: coordPoint,
    noise: pipe(
      P.tuple(coord, coord),
      P.map(([x, y]) => ({ x, y, z: 0 }))
    ),
    count: B.uint8,
    decalIndex: B.uint8
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_MULTIGUNSHOT,
    name: 'TE_MULTIGUNSHOT',
    fields
  }))
);
