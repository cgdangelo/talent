import { parser as P } from '@cgdangelo/talent-parser';
import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import { pipe } from 'fp-ts/lib/function';
import { type Point } from '../../../../Point';
import { coordPoint } from './coord';
import { TempEntityType } from './TempEntityType';

export type StreakSplash = {
  readonly id: TempEntityType.TE_STREAK_SPLASH;
  readonly name: 'TE_STREAK_SPLASH';
  readonly fields: {
    readonly startPosition: Point;
    readonly vector: Point;
    readonly color: number;
    readonly count: number;
    readonly velocity: number;
    readonly velocityRandomness: number;
  };
};

export const streakSplash: B.BufferParser<StreakSplash> = pipe(
  P.struct({
    startPosition: coordPoint,
    vector: coordPoint,
    color: B.uint8,
    count: B.int16_le,
    velocity: B.int16_le,
    velocityRandomness: B.int16_le
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_STREAK_SPLASH,
    name: 'TE_STREAK_SPLASH',
    fields
  }))
);
