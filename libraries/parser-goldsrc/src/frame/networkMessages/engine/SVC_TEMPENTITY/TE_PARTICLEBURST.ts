import { parser as P } from '@cgdangelo/talent-parser';
import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import { pipe } from 'fp-ts/lib/function';
import { type Point } from '../../../../Point';
import { coordPoint } from './coord';
import { TempEntityType } from './TempEntityType';

export type ParticleBurst = {
  readonly id: TempEntityType.TE_PARTICLEBURST;
  readonly name: 'TE_PARTICLEBURST';
  readonly fields: {
    readonly origin: Point;
    readonly scale: number;
    readonly color: number;
    readonly duration: number;
  };
};

export const particleBurst: B.BufferParser<ParticleBurst> = pipe(
  P.struct({
    origin: coordPoint,
    scale: B.int16_le,
    color: B.uint8,
    duration: B.uint8
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_PARTICLEBURST,
    name: 'TE_PARTICLEBURST',
    fields
  }))
);
