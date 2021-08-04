import * as P from "@talent/parser";
import { either as E } from "fp-ts";
import { sequenceS } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";
import type { NetMsgInfo } from "./netMsgInfo";
import { netMsgInfo } from "./netMsgInfo";
import { toError } from "./utils";

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

const msgLength: P.Parser<Buffer, number> = pipe(
  P.int32_le,
  P.chain((a) =>
    a > 0 && a < 65_536
      ? P.succeed(a)
      : P.fail(toError("invalid netmsg length")(a))
  )
);

const msg: (msgLength: number) => P.Parser<Buffer, Buffer> =
  (msgLength) => (i) =>
    pipe(
      E.tryCatch(
        () => i.buffer.slice(i.cursor, i.cursor + msgLength),
        E.toError
      ),
      // FIXME Kinda gross.
      E.chain((a) => P.success(a, i, i.cursor + msgLength))
    );

export const netMsg: P.Parser<Buffer, NetMsg> = pipe(
  sequenceS(P.Applicative)({
    info: netMsgInfo,
    incomingSequence: P.int32_le,
    incomingAcknowledged: P.int32_le,
    incomingReliableAcknowledged: P.int32_le,
    incomingReliableSequence: P.int32_le,
    outgoingSequence: P.int32_le,
    reliableSequence: P.int32_le,
    lastReliableSequence: P.int32_le,
    msgLength,
  }),

  P.chain((a) =>
    pipe(
      msg(a.msgLength),
      P.map((msg) => ({ ...a, msg }))
    )
  )
);
