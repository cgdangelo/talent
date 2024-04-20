import { type buffer as B } from '@cgdangelo/talent-parser-buffer';
import * as P from '@cgdangelo/talent-parser/lib/Parser';
import { MessageType } from '../MessageType';

export type FoundSecret = {
  readonly id: MessageType.SVC_FOUNDSECRET;
  readonly name: 'SVC_FOUNDSECRET';
};

// Deprecated. Probably old Q2 message?
export const foundSecret: B.BufferParser<FoundSecret> = P.of({
  id: MessageType.SVC_FOUNDSECRET,
  name: 'SVC_FOUNDSECRET'
});
