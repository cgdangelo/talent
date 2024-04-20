import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import * as P from '@cgdangelo/talent-parser/lib/Parser';
import { pipe } from 'fp-ts/lib/function';
import { MessageType } from '../MessageType';

export type Director = {
  readonly id: MessageType.SVC_DIRECTOR;
  readonly name: 'SVC_DIRECTOR';

  readonly fields: {
    // TODO Unknown how to decode these fields; does it vary per mod?
    readonly data: readonly number[];
  };
};

export const director: B.BufferParser<Director> = pipe(
  B.uint8,

  P.chain((length) =>
    P.struct({
      data: P.take(length)
    })
  ),

  P.map((fields) => ({
    id: MessageType.SVC_DIRECTOR,
    name: 'SVC_DIRECTOR',
    fields
  }))
);
