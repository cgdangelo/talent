import { parser as P, parseResult as PR } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { sequenceS } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";
import type { NetMsgInfo } from "./netMsgInfo";
import { netMsgInfo } from "./netMsgInfo";

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

const msgLength: B.BufferParser<number> = pipe(
  B.int32_le,
  P.chain((a) =>
    a > 0 && a < 65_536 ? P.succeed(a) : P.fail(`invalid netmsg length ${a}`)
  )
);

const msg: (msgLength: number) => B.BufferParser<Buffer> = (msgLength) => (i) =>
  PR.success(i.buffer.slice(i.cursor, i.cursor + msgLength), i, i);

export const netMsg: B.BufferParser<NetMsg> = pipe(
  sequenceS(P.Applicative)({
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
