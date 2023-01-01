import { parser as P } from '@cgdangelo/talent-parser';
import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import { pipe } from 'fp-ts/lib/function';
import type { Point } from '../../../../Point';
import { coordPoint } from './coord';
import { TempEntityType } from './TempEntityType';

export type Spray = {
  readonly id: TempEntityType.TE_SPRAY;
  readonly name: 'TE_SPRAY';
  readonly fields: {
    readonly position: Point;
    readonly direction: Point;
    readonly modelIndex: number;
    readonly count: number;
    readonly life: number;
    readonly owner: number;
  };
};

export const spray: B.BufferParser<Spray> = pipe(
  P.struct({
    position: coordPoint,
    direction: coordPoint,
    modelIndex: B.int16_le,
    count: B.uint8,
    life: B.uint8,
    owner: B.uint8
  }),

  P.map((fields) => ({ id: TempEntityType.TE_SPRAY, name: 'TE_SPRAY', fields }))
);
