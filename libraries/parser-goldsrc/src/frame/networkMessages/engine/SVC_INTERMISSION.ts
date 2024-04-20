import { type buffer as B } from '@cgdangelo/talent-parser-buffer';
import * as P from '@cgdangelo/talent-parser/lib/Parser';
import { MessageType } from '../MessageType';

export type Intermission = {
  readonly id: MessageType.SVC_INTERMISSION;
  readonly name: 'SVC_INTERMISSION';
};

export const intermission: B.BufferParser<Intermission> = P.of({
  id: MessageType.SVC_INTERMISSION,
  name: 'SVC_INTERMISSION'
});
