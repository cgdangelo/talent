import type { buffer as B } from '@cgdangelo/talent-parser-buffer';
import * as P from '@cgdangelo/talent-parser/lib/Parser';
import { MessageType } from '../MessageType';

export type Nop = {
  readonly id: MessageType.SVC_NOP;
  readonly name: 'SVC_NOP';
};

export const nop: B.BufferParser<Nop> = P.of({
  id: MessageType.SVC_NOP,
  name: 'SVC_NOP'
});
