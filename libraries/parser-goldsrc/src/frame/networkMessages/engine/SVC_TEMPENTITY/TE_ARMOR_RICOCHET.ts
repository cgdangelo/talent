import { parser as P } from '@cgdangelo/talent-parser';
import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import { pipe } from 'fp-ts/lib/function';
import type { Point } from '../../../../Point';
import { coordPoint } from './coord';
import { TempEntityType } from './TempEntityType';

export type ArmorRicochet = {
  readonly id: TempEntityType.TE_ARMOR_RICOCHET;
  readonly name: 'TE_ARMOR_RICOCHET';
  readonly fields: {
    readonly position: Point;
    readonly scale: number;
  };
};

export const armorRicochet: B.BufferParser<ArmorRicochet> = pipe(
  P.struct({
    position: coordPoint,
    scale: B.uint8_le
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_ARMOR_RICOCHET,
    name: 'TE_ARMOR_RICOCHET',
    fields
  }))
);
