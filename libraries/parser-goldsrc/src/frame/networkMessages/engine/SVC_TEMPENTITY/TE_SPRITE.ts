import { parser as P } from '@cgdangelo/talent-parser';
import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import { pipe } from 'fp-ts/lib/function';
import type { Point } from '../../../../Point';
import { coordPoint } from './coord';
import { TempEntityType } from './TempEntityType';

export type Sprite = {
  readonly id: TempEntityType.TE_SPRITE;
  readonly name: 'TE_SPRITE';
  readonly fields: {
    readonly position: Point;
    readonly spriteIndex: number;
    readonly scale: number;
    readonly brightness: number;
  };
};

export const sprite: B.BufferParser<Sprite> = pipe(
  P.struct({
    position: coordPoint,
    spriteIndex: B.int16_le,
    scale: B.uint8,
    brightness: B.uint8
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_SPRITE,
    name: 'TE_SPRITE',
    fields
  }))
);
