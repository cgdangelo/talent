import { parser as P } from '@cgdangelo/talent-parser';
import type { buffer as B } from '@cgdangelo/talent-parser-buffer';
import { pipe } from 'fp-ts/lib/function';
import type { Point } from '../../../../Point';
import { coordPoint } from './coord';
import { TempEntityType } from './TempEntityType';

export type ShowLine = {
  readonly id: TempEntityType.TE_SHOWLINE;
  readonly name: 'TE_SHOWLINE';
  readonly fields: {
    readonly startPosition: Point;
    readonly endPosition: Point;
  };
};

export const showLine: B.BufferParser<ShowLine> = pipe(
  P.struct({
    startPosition: coordPoint,
    endPosition: coordPoint
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_SHOWLINE,
    name: 'TE_SHOWLINE',
    fields
  }))
);
