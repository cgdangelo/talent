import { parser as P } from '@cgdangelo/talent-parser';
import { type buffer as B } from '@cgdangelo/talent-parser-buffer';
import { pipe } from 'fp-ts/lib/function';
import { type Point } from '../../../../Point';
import { coordPoint } from './coord';
import { TempEntityType } from './TempEntityType';

export type Tracer = {
  readonly id: TempEntityType.TE_TRACER;
  readonly name: 'TE_TRACER';
  readonly fields: {
    readonly startPosition: Point;
    readonly endPosition: Point;
  };
};

export const tracer: B.BufferParser<Tracer> = pipe(
  P.struct({
    startPosition: coordPoint,
    endPosition: coordPoint
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_TRACER,
    name: 'TE_TRACER',
    fields
  }))
);
