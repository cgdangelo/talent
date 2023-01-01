import { parser as P } from '@cgdangelo/talent-parser';
import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import { pipe } from 'fp-ts/lib/function';
import type { Point } from '../../../../Point';
import { coordPoint } from './coord';
import { TempEntityType } from './TempEntityType';

export type BeamDisk = {
  readonly id: TempEntityType.TE_BEAMDISK;
  readonly name: 'TE_BEAMDISK';
  readonly fields: {
    readonly position: Point;
    readonly axis: Point;
    readonly spriteIndex: number;
    readonly startFrame: number;
    readonly frameRate: number;
    readonly life: number;
    readonly width: number;
    readonly noise: number;
    readonly color: {
      readonly r: number;
      readonly g: number;
      readonly b: number;
      readonly a: number;
    };
    readonly speed: number;
  };
};

export const beamDisk: B.BufferParser<BeamDisk> = pipe(
  P.struct({
    position: coordPoint,
    axis: coordPoint,
    spriteIndex: B.int16_le,
    startFrame: B.uint8,
    frameRate: B.uint8,
    life: B.uint8,
    width: B.uint8,
    noise: B.uint8,
    color: P.struct({
      r: B.uint8,
      g: B.uint8,
      b: B.uint8,
      a: B.uint8
    }),
    speed: B.uint8
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_BEAMDISK,
    name: 'TE_BEAMDISK',
    fields
  }))
);
