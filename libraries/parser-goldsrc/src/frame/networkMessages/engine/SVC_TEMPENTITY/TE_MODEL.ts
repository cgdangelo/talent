import { parser as P } from '@cgdangelo/talent-parser';
import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import { pipe } from 'fp-ts/lib/function';
import { type Point } from '../../../../Point';
import { coordPoint } from './coord';
import { TempEntityType } from './TempEntityType';

export type Model = {
  readonly id: TempEntityType.TE_MODEL;
  readonly name: 'TE_MODEL';
  readonly fields: {
    readonly position: Point;
    readonly velocity: Point;
    readonly angle: {
      readonly pitch: number;
      readonly yaw: number;
      readonly roll: number;
    };
    readonly modelIndex: number;
    readonly flags: number;
    readonly life: number;
  };
};

export const model: B.BufferParser<Model> = pipe(
  P.struct({
    position: coordPoint,
    velocity: coordPoint,
    angle: pipe(
      B.int8, // TODO ???
      P.map((yaw) => ({ pitch: 0, yaw, roll: 0 }))
    ),
    modelIndex: B.int16_le,
    flags: B.uint8,
    life: pipe(
      B.uint8
      // P.map((a) => a * 10)
    )
  }),

  P.map((fields) => ({ id: TempEntityType.TE_MODEL, name: 'TE_MODEL', fields }))
);
