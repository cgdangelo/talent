import { parser as P } from '@cgdangelo/talent-parser';
import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import { pipe } from 'fp-ts/lib/function';
import type { Point } from '../../../../Point';
import { coordPoint } from './coord';
import { TempEntityType } from './TempEntityType';

export type LargeFunnel = {
  readonly id: TempEntityType.TE_LARGEFUNNEL;
  readonly name: 'TE_LARGEFUNNEL';
  readonly fields: {
    readonly position: Point;
    readonly modelIndex: number;
    readonly flags: number;
  };
};

export const largeFunnel: B.BufferParser<LargeFunnel> = pipe(
  P.struct({
    position: coordPoint,
    modelIndex: B.int16_le,
    flags: B.int16_le
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_LARGEFUNNEL,
    name: 'TE_LARGEFUNNEL',
    fields
  }))
);
