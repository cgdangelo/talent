import { parser as P } from '@cgdangelo/talent-parser';
import { type buffer as B } from '@cgdangelo/talent-parser-buffer';
import { pipe } from 'fp-ts/lib/function';
import { type Point } from '../../../../Point';
import { coordPoint } from './coord';
import { TempEntityType } from './TempEntityType';

export type Gunshot = {
  readonly id: TempEntityType.TE_GUNSHOT;
  readonly name: 'TE_GUNSHOT';
  readonly fields: {
    readonly position: Point;
  };
};

export const gunshot: B.BufferParser<Gunshot> = pipe(
  P.struct({ position: coordPoint }),

  P.map((fields) => ({
    id: TempEntityType.TE_GUNSHOT,
    name: 'TE_GUNSHOT',
    fields
  }))
);
