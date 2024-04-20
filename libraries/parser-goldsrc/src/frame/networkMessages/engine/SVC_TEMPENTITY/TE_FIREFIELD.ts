import { parser as P } from '@cgdangelo/talent-parser';
import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import { pipe } from 'fp-ts/lib/function';
import { type Point } from '../../../../Point';
import { coordPoint } from './coord';
import { TempEntityType } from './TempEntityType';

export type FireField = {
  readonly id: TempEntityType.TE_FIREFIELD;
  readonly name: 'TE_FIREFIELD';
  readonly fields: {
    readonly origin: Point;
    readonly scale: number;
    readonly modelIndex: number;
    readonly count: number;
    readonly flags: number;
    readonly duration: number;
  };
};

export const fireField: B.BufferParser<FireField> = pipe(
  P.struct({
    origin: coordPoint,
    scale: B.int16_le,
    modelIndex: B.int16_le,
    count: B.uint8,
    flags: B.uint8,
    duration: B.uint8
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_FIREFIELD,
    name: 'TE_FIREFIELD',
    fields
  }))
);
