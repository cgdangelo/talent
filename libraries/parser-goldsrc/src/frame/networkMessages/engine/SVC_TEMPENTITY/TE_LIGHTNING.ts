import { parser as P } from '@cgdangelo/talent-parser';
import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import { pipe } from 'fp-ts/lib/function';
import type { Point } from '../../../../Point';
import { coordPoint } from './coord';
import { TempEntityType } from './TempEntityType';

export type Lightning = {
  readonly id: TempEntityType.TE_LIGHTNING;
  readonly name: 'TE_LIGHTNING';
  readonly fields: {
    readonly startPosition: Point;
    readonly endPosition: Point;
    readonly life: number;
    readonly width: number;
    readonly noise: number;
    readonly modelIndex: number;
  };
};

export const lightning: B.BufferParser<Lightning> = pipe(
  P.struct({
    startPosition: coordPoint,
    endPosition: coordPoint,
    life: B.uint8,
    width: B.uint8,
    noise: B.uint8,
    modelIndex: B.int16_le
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_LIGHTNING,
    name: 'TE_LIGHTNING',
    fields
  }))
);
