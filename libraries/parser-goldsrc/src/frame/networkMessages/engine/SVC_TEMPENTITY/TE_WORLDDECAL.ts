import { parser as P } from '@cgdangelo/talent-parser';
import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import { pipe } from 'fp-ts/lib/function';
import type { Point } from '../../../../Point';
import { coordPoint } from './coord';
import { TempEntityType } from './TempEntityType';

export type WorldDecal = {
  readonly id: TempEntityType.TE_WORLDDECAL;
  readonly name: 'TE_WORLDDECAL';
  readonly fields: {
    readonly position: Point;
    readonly textureIndex: number;
  };
};

export const worldDecal: B.BufferParser<WorldDecal> = pipe(
  P.struct({
    position: coordPoint,
    textureIndex: B.uint8
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_WORLDDECAL,
    name: 'TE_WORLDDECAL',
    fields
  }))
);
