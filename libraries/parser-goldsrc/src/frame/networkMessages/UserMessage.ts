import { parser as P, statefulParser as SP } from '@cgdangelo/talent-parser';
import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import { number, option as O, readonlyMap as RM } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import * as DS from '../../DemoState';

export type UserMessage = {
  readonly id: number;
  readonly name: string;
  readonly data: Buffer;
};

const lookupUserMessage = RM.lookup(number.Eq);

export const userMessage: (messageId: number) => DS.DemoStateParser<UserMessage> = (messageId) =>
  pipe(
    DS.get(),
    SP.chain(({ userMessages }) =>
      pipe(
        lookupUserMessage(messageId)(userMessages),

        // Found the user message from a previous SVC_NEWUSERMSG payload
        O.map(({ index: id, name, size }) =>
          pipe(
            size > -1
              ? // If we have a sized message, return the size
                P.of(size)
              : // If we have an unsized message, read the length first
                B.uint8,

            DS.lift,

            // We have a message size, so grab those bytes
            SP.chain((size) => SP.take(size)),

            SP.map((data) => ({ id, name, data: data as unknown as Buffer } as UserMessage))
          )
        ),

        // TODO Should we fail or just read the size and return as an "Unknown" message?
        O.getOrElseW(() => SP.fail<DS.DemoState, number>())
      )
    )
  );
