import { either as E } from "fp-ts";
import { sequenceS } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";
import type { NetMsgInfo } from "./netMsgInfo";
import { netMsgInfo } from "./netMsgInfo";
import { int32_le } from "./parser";

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

export const netMsg =
  (buffer: Buffer) =>
  (cursor = 0): E.Either<Error, NetMsg> =>
    pipe(
      sequenceS(E.Applicative)({
        info: netMsgInfo(buffer)(cursor),
        incomingSequence: int32_le(buffer)(cursor),
        incomingAcknowledged: int32_le(buffer)(cursor),
        incomingReliableAcknowledged: int32_le(buffer)(cursor),
        incomingReliableSequence: int32_le(buffer)(cursor),
        outgoingSequence: int32_le(buffer)(cursor),
        reliableSequence: int32_le(buffer)(cursor),
        lastReliableSequence: int32_le(buffer)(cursor),
        msgLength: int32_le(buffer)(cursor), // TODO Validate
        msg: E.right({}),
      })
    );
