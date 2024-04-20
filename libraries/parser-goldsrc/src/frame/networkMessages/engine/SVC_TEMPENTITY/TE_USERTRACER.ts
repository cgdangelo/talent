import { parser as P } from '@cgdangelo/talent-parser';
import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import { pipe } from 'fp-ts/lib/function';
import { type Point } from '../../../../Point';
import { coordPoint } from './coord';
import { TempEntityType } from './TempEntityType';

export type UserTracer = {
  readonly id: TempEntityType.TE_USERTRACER;
  readonly name: 'TE_USERTRACER';
  readonly fields: {
    readonly origin: Point;
    readonly velocity: Point;
    readonly life: number;
    readonly color: number;
    readonly scale: number;
  };
};

export const userTracer: B.BufferParser<UserTracer> = pipe(
  P.struct({
    origin: coordPoint,
    velocity: coordPoint,
    life: B.uint8,
    color: B.uint8,
    scale: B.uint8
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_USERTRACER,
    name: 'TE_USERTRACER',
    fields
  }))
);
