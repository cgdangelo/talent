import { parser as P, statefulParser as SP } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import type { DemoState, DemoStateParser } from "../../DemoState";
import type { Message } from "./Message";
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
  readonly messages: readonly Message[];
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

export const networkMessages: DemoStateParser<NetworkMessages> = pipe(
  SP.lift<number, Omit<NetworkMessages, "messages">, DemoState>(
    P.struct({
      info: networkMessagesInfo,
      incomingSequence: B.int32_le,
      incomingAcknowledged: B.int32_le,
      incomingReliableAcknowledged: B.int32_le,
      incomingReliableSequence: B.int32_le,
      outgoingSequence: B.int32_le,
      reliableSequence: B.int32_le,
      lastReliableSequence: B.int32_le,
    })
  ),

  SP.bind("messages", () =>
    pipe(SP.lift<number, number, DemoState>(messagesLength), SP.chain(messages))
  )
);
