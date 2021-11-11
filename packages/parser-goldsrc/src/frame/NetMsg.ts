import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";
import type { NetMsgInfo } from "./NetMsgInfo";
import { netMsgInfo } from "./NetMsgInfo";

export type NetMsg = {
  readonly info: NetMsgInfo;
  readonly incomingSequence: number;
  readonly incomingAcknowledged: number;
  readonly incomingReliableAcknowledged: number;
  readonly incomingReliableSequence: number;
  readonly outgoingSequence: number;
  readonly reliableSequence: number;
  readonly lastReliableSequence: number;
  readonly msgLength: number;
  readonly msg: unknown;
};

export type NetMsgFrameType = "Start" | "Normal" | number;

export const netMsgFrameType = (a: number): NetMsgFrameType => {
  switch (a) {
    case 0:
      return "Start";
    case 1:
      return "Normal";
    default:
      return a;
  }
};

const msgLength: B.BufferParser<number> = P.expected(
  pipe(
    B.int32_le,
    P.filter((a) => a > 0 && a < 65_536)
  ),
  "[0, 65_536]"
);

const msg: (msgLength: number) => B.BufferParser<unknown> = (msgLength) =>
  pipe(
    P.take<number>(msgLength),
    P.map((a) => a as unknown as Buffer)
    // P.chain(messages)
  );

export const netMsg: B.BufferParser<NetMsg> = pipe(
  P.struct({
    info: netMsgInfo,
    incomingSequence: B.int32_le,
    incomingAcknowledged: B.int32_le,
    incomingReliableAcknowledged: B.int32_le,
    incomingReliableSequence: B.int32_le,
    outgoingSequence: B.int32_le,
    reliableSequence: B.int32_le,
    lastReliableSequence: B.int32_le,
    msgLength,
  }),

  P.chain((a) =>
    pipe(
      msg(a.msgLength),
      P.map((msg) => ({ ...a, msg }))
    )
  )
);
