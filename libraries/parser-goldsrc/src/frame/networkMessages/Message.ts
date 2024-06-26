import { parser as P, statefulParser as SP } from '@cgdangelo/talent-parser';
import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import { pipe } from 'fp-ts/lib/function';
import * as DS from '../../DemoState';
import { type EngineMessage } from './EngineMessage';
import { engineMessage } from './EngineMessage';
import { type UserMessage } from './UserMessage';
import { userMessage } from './UserMessage';

export type Message =
  | { readonly type: 'engine'; readonly message: EngineMessage }
  | { readonly type: 'user'; readonly message: UserMessage };

export const messages: (messagesLength: number) => DS.DemoStateParser<readonly Message[]> =
  (messagesLength) => (s) => (i) =>
    pipe(
      i,

      pipe(
        SP.manyTill(
          message,

          SP.lift(
            pipe(
              P.withStart(P.of<number, void>(undefined)),
              P.filter(([, { cursor: currentPosition }]) => currentPosition === i.cursor + messagesLength)
            )
          )
        )
      )(s)
    );

const message: DS.DemoStateParser<Message> = pipe(
  DS.lift(B.uint8),
  SP.chain(
    (messageId): DS.DemoStateParser<Message> =>
      messageId >= 64
        ? pipe(
            userMessage(messageId),
            SP.map((message) => ({ type: 'user', message } as const)),
            SP.chainFirst(({ message: userMessage }) =>
              pipe(
                DS.get(),
                SP.map(({ eventEmitter }) => eventEmitter?.emit('demo:netmessage:user', userMessage))
              )
            )
          )
        : pipe(
            engineMessage(messageId),
            SP.map((message) => ({ type: 'engine', message } as const)),
            SP.chainFirst(({ message: engineMessage }) =>
              pipe(
                DS.get(),
                SP.map(({ eventEmitter }) => eventEmitter?.emit('demo:netmessage:engine', engineMessage))
              )
            )
          )
  )
);
