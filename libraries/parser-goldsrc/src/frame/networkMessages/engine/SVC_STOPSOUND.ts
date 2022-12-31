import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import * as P from '@cgdangelo/talent-parser/lib/Parser';
import { pipe } from 'fp-ts/lib/function';
import { MessageType } from '../MessageType';

export type StopSound = {
  readonly id: MessageType.SVC_STOPSOUND;
  readonly name: 'SVC_STOPSOUND';

  readonly fields: {
    readonly entityIndex: number;
  };
};

export const stopSound: B.BufferParser<StopSound> = pipe(
  P.struct({ entityIndex: B.int16_le }),

  P.map((fields) => ({
    id: MessageType.SVC_STOPSOUND,
    name: 'SVC_STOPSOUND',
    fields
  }))
);
