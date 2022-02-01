import { parser as P, statefulParser as SP } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import type { DemoStateParser } from "../../DemoState";
import type { EngineMessage } from "./EngineMessage";
import { engineMessage } from "./EngineMessage";
import type { UserMessage } from "./UserMessage";
import { userMessage } from "./UserMessage";

export type Message =
  | { readonly type: "engine"; readonly message: EngineMessage }
  | { readonly type: "user"; readonly message: UserMessage };

export const messages: (
  messagesLength: number
) => DemoStateParser<readonly Message[]> = (messagesLength) => (s) => (i) =>
  pipe(
    i,

    pipe(
      SP.manyTill(
        message,

        SP.lift(
          pipe(
            P.withStart(P.of<number, void>(undefined)),
            P.filter(
              ([, { cursor: currentPosition }]) =>
                currentPosition === i.cursor + messagesLength
            )
          )
        )
      )
    )(s)
  );

const message: DemoStateParser<Message> = pipe(
  SP.lift(B.uint8_le) as DemoStateParser<number>,
  SP.chain(
    (messageId): DemoStateParser<Message> =>
      messageId >= 64
        ? pipe(
            userMessage(messageId),
            SP.map((message) => ({ type: "user", message }))
          )
        : pipe(
            engineMessage(messageId),
            SP.map((message) => ({ type: "engine", message }))
          )
  )
);
