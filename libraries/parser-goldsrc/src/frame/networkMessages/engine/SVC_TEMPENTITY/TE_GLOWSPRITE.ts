import { parser as P } from '@cgdangelo/talent-parser';
import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import { pipe } from 'fp-ts/lib/function';
import type { Point } from '../../../../Point';
import { coordPoint } from './coord';
import { TempEntityType } from './TempEntityType';

export type GlowSprite = {
  readonly id: TempEntityType.TE_GLOWSPRITE;
  readonly name: 'TE_GLOWSPRITE';
  readonly fields: {
    readonly position: Point;
    readonly modelIndex: number;
    readonly scale: number;
    readonly size: number;
    readonly brightness: number;
  };
};

export const glowSprite: B.BufferParser<GlowSprite> = pipe(
  P.struct({
    position: coordPoint,
    modelIndex: B.int16_le,
    scale: B.uint8,
    size: B.uint8,
    brightness: B.uint8
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_GLOWSPRITE,
    name: 'TE_GLOWSPRITE',
    fields
  }))
);
