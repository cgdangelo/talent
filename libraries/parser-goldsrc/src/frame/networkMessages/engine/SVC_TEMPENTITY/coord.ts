import { parser as P } from '@cgdangelo/talent-parser';
import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import { pipe } from 'fp-ts/lib/function';
import { type Point } from '../../../../Point';
import { pointBy } from '../../../../Point';

export const coord: B.BufferParser<number> = pipe(
  B.int16_le,
  P.map((a) => a / 8)
);

// https://github.com/FWGS/xash3d-fwgs/blob/588dede2a2970477d59e333e97fb9ace4ca0b9e8/engine/common/net_buffer.c#L597-L603
export const coordPoint: B.BufferParser<Point> = pointBy(coord);
