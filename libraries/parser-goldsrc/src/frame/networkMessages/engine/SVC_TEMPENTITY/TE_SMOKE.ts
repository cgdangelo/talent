import { parser as P } from '@cgdangelo/talent-parser';
import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import { pipe } from 'fp-ts/lib/function';
import type { Point } from '../../../../Point';
import { coordPoint } from './coord';
import { TempEntityType } from './TempEntityType';

export type Smoke = {
  readonly id: TempEntityType.TE_SMOKE;
  readonly name: 'TE_SMOKE';
  readonly fields: {
    readonly position: Point;
    readonly spriteIndex: number;
    readonly scale: number;
    readonly frameRate: number;
  };
};

export const smoke: B.BufferParser<Smoke> = pipe(
  P.struct({
    position: coordPoint,
    spriteIndex: B.int16_le,
    scale: B.uint8_le,
    frameRate: B.uint8_le
  }),

  P.map((fields) => ({ id: TempEntityType.TE_SMOKE, name: 'TE_SMOKE', fields }))
);
