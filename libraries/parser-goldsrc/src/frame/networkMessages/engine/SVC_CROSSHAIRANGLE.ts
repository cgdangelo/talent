import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import * as P from '@cgdangelo/talent-parser/lib/Parser';
import { pipe } from 'fp-ts/lib/function';
import { MessageType } from '../MessageType';

export type CrosshairAngle = {
  readonly id: MessageType.SVC_CROSSHAIRANGLE;
  readonly name: 'SVC_CROSSHAIRANGLE';

  readonly fields: {
    readonly pitch: number;
    readonly yaw: number;
  };
};

export const crosshairAngle: B.BufferParser<CrosshairAngle> = pipe(
  P.struct({ pitch: B.int8, yaw: B.int8 }),

  P.map((fields) => ({
    id: MessageType.SVC_CROSSHAIRANGLE,
    name: 'SVC_CROSSHAIRANGLE',
    fields
  }))
);
