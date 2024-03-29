import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import * as P from '@cgdangelo/talent-parser/lib/Parser';
import { pipe } from 'fp-ts/lib/function';
import { MessageType } from '../MessageType';

export type SetAngle = {
  readonly id: MessageType.SVC_SETANGLE;
  readonly name: 'SVC_SETANGLE';

  readonly fields: {
    readonly pitch: number;
    readonly yaw: number;
    readonly roll: number;
  };
};

// TODO The provided angles need to be scaled by (65536 / 360), but
// hlviewer does not?
export const setAngle: B.BufferParser<SetAngle> = pipe(
  B.int16_le,
  P.map((a) => a / (65536 / 360)),
  (fa) => P.tuple(fa, fa, fa),
  P.map(([pitch, yaw, roll]) => ({ pitch, yaw, roll })),

  P.map((fields) => ({
    id: MessageType.SVC_SETANGLE,
    name: 'SVC_SETANGLE',
    fields
  }))
);
