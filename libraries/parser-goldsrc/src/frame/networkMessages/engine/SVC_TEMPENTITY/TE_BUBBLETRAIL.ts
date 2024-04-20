import { parser as P } from '@cgdangelo/talent-parser';
import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import { pipe } from 'fp-ts/lib/function';
import { type Point } from '../../../../Point';
import { coord, coordPoint } from './coord';
import { TempEntityType } from './TempEntityType';

export type BubbleTrail = {
  readonly id: TempEntityType.TE_BUBBLETRAIL;
  readonly name: 'TE_BUBBLETRAIL';
  readonly fields: {
    readonly minStartPosition: Point;
    readonly maxStartPosition: Point;
    readonly scale: number;
    readonly modelIndex: number;
    readonly count: number;
    readonly speed: number;
  };
};

export const bubbleTrail: B.BufferParser<BubbleTrail> = pipe(
  P.struct({
    minStartPosition: coordPoint,
    maxStartPosition: coordPoint,
    scale: coord,
    modelIndex: B.int16_le,
    count: B.uint8,
    speed: coord
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_BUBBLETRAIL,
    name: 'TE_BUBBLETRAIL',
    fields
  }))
);
