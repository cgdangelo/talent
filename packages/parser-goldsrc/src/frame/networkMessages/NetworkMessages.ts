import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";
import { messages } from "./Message";
import type { NetworkMessagesInfo } from "./NetworkMessagesInfo";
import { networkMessagesInfo } from "./NetworkMessagesInfo";

export type NetworkMessages = {
  readonly info: NetworkMessagesInfo;
  readonly incomingSequence: number;
  readonly incomingAcknowledged: number;
  readonly incomingReliableAcknowledged: number;
  readonly incomingReliableSequence: number;
  readonly outgoingSequence: number;
  readonly reliableSequence: number;
  readonly lastReliableSequence: number;
  readonly messages: readonly unknown[];
};

export type NetworkMessagesFrameType = "Start" | "Normal" | number;

export const networkMessagesFrameType = (
  a: number
): NetworkMessagesFrameType => {
  switch (a) {
    case 0:
      return "Start";
    case 1:
      return "Normal";
    default:
      return a;
  }
};

const messagesLength: B.BufferParser<number> = P.expected(
  pipe(
    B.uint32_le,
    P.filter((a) => a > 0 && a < 65_536)
  ),
  "message length [0, 65_536]"
);

export const networkMessages: B.BufferParser<NetworkMessages> = P.struct({
  info: networkMessagesInfo,
  incomingSequence: B.int32_le,
  incomingAcknowledged: B.int32_le,
  incomingReliableAcknowledged: B.int32_le,
  incomingReliableSequence: B.int32_le,
  outgoingSequence: B.int32_le,
  reliableSequence: B.int32_le,
  lastReliableSequence: B.int32_le,
  messages: pipe(messagesLength, P.chain(messages)),
});
