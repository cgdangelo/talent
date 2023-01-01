import { parser as P } from '@cgdangelo/talent-parser';
import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import { pipe } from 'fp-ts/lib/function';
import type { Point } from '../../../../Point';
import { coordPoint } from './coord';
import { TempEntityType } from './TempEntityType';

export type SpriteSpray = {
  readonly id: TempEntityType.TE_SPRITE_SPRAY;
  readonly name: 'TE_SPRITE_SPRAY';
  readonly fields: {
    readonly position: Point;
    readonly velocity: Point;
    readonly modelIndex: number;
    readonly count: number;
    readonly speed: number;
  };
};

export const spriteSpray: B.BufferParser<SpriteSpray> = pipe(
  P.struct({
    position: coordPoint,
    velocity: coordPoint,
    modelIndex: B.int16_le,
    count: B.uint8,
    speed: B.uint8,
    random: B.uint8
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_SPRITE_SPRAY,
    name: 'TE_SPRITE_SPRAY',
    fields
  }))
);
