import { parser as P, statefulParser as SP } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { number, option as O, readonlyMap as RM } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import type { DemoState, DemoStateParser } from "../../DemoState";
import type { EngineMessage } from "./EngineMessage";
import { engineMessage } from "./EngineMessage";
import { MessageType } from "./MessageType";

export type Message = void | EngineMessage;

export const messages: (
  messagesLength: number
) => DemoStateParser<readonly Message[]> = (messagesLength) => (s) => (i) =>
  pipe(
    i,

    pipe(
      SP.manyTill(
        SP.log(message),

        SP.lift(
          pipe(
            P.withStart(P.of<number, void>(undefined)),
            P.filter(
              ([, { cursor: currentPosition }]) =>
                currentPosition === i.cursor + messagesLength
            )
          )
        )
      ),

      SP.alt(() =>
        SP.lift(
          pipe(
            P.of<number, readonly Message[]>([]),
            P.apFirst(P.seek(i.cursor + messagesLength))
          )
        )
      )
    )(s)
  );

const message: DemoStateParser<Message> = pipe(
  SP.lift<number, number, DemoState>(B.uint8_le),

  SP.chain((messageId) =>
    pipe(
      engineMessage(messageId),

      SP.altW(() => skipUserMessage(messageId)),

      // TODO Can remove SVC_NOP, deprecated messages, but NOT messages that
      // have no arguments.
      SP.filter(() => messageId !== MessageType.SVC_NOP)
    )
  )
);

const skipUserMessage: (messageId: number) => DemoStateParser<void> = (
  messageId
) =>
  pipe(
    SP.get<number, DemoState>(),
    SP.chain(({ userMessages }) =>
      pipe(
        userMessages,
        RM.lookup(number.Eq)(messageId),
        O.chain(O.fromPredicate(({ size }) => size > -1)),
        O.fold(
          () => SP.lift(B.uint8_le),
          ({ size }) => SP.of(size)
        )
      )
    ),

    SP.chain((customMessageSize) => SP.lift(P.skip(customMessageSize)))
  );
