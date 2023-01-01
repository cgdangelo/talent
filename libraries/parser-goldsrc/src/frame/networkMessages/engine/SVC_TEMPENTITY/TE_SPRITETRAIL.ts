import { parser as P } from '@cgdangelo/talent-parser';
import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import { pipe } from 'fp-ts/lib/function';
import type { Point } from '../../../../Point';
import { coordPoint } from './coord';
import { TempEntityType } from './TempEntityType';

export type SpriteTrail = {
  readonly id: TempEntityType.TE_SPRITETRAIL;
  readonly name: 'TE_SPRITETRAIL';
  readonly fields: {
    readonly startPosition: Point;
    readonly endPosition: Point;
    readonly spriteIndex: number;
    readonly count: number;
    readonly life: number;
    readonly scale: number;
    readonly velocity: number;
    readonly velocityRandomness: number;
  };
};

export const spriteTrail: B.BufferParser<SpriteTrail> = pipe(
  P.struct({
    startPosition: coordPoint,
    endPosition: coordPoint,
    spriteIndex: B.int16_le,
    count: B.uint8,
    life: B.uint8,
    scale: B.uint8,
    velocity: B.uint8,
    velocityRandomness: B.uint8
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_SPRITETRAIL,
    name: 'TE_SPRITETRAIL',
    fields
  }))
);
