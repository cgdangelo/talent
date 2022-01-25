import { parser as P, statefulParser as SP } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { number, option as O, readonlyMap as RM } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import type { DemoState, DemoStateParser } from "../../DemoState";

export type UserMessage = unknown;

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

export const userMessage: (messageId: number) => DemoStateParser<UserMessage> =
  skipUserMessage;
