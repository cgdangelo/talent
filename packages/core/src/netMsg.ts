import { either as E } from "fp-ts";
import { sequenceS } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";
import type { NetMsgInfo } from "./netMsgInfo";
import { netMsgInfo } from "./netMsgInfo";

export type NetMsg = {
  readonly info: NetMsgInfo;
  // readonly incomingSequence: number;
  // readonly incomingAcknowledged: number;
  // readonly incomingReliableAcknowledged: number;
  // readonly incomingReliableSequence: number;
  // readonly outgoingSequence: number;
  // readonly reliableSequence: number;
  // readonly lastReliableSequence: number;
  // readonly msgLength: number;
  // readonly msg: unknown;
};

export const netMsg =
  (buffer: Buffer) =>
  (cursor = 0): E.Either<Error, NetMsg> =>
    pipe(
      // prettier-ignore
      sequenceS(E.Applicative)({
        info: netMsgInfo(buffer)(cursor),
        // incomingSequence: int32_le(buffer)(cursor + 232),
        // incomingAcknowledged: int32_le(buffer)(cursor + 232 + 4),
        // incomingReliableAcknowledged: int32_le(buffer)(cursor + 232 + 4 + 4),
        // incomingReliableSequence: int32_le(buffer)(cursor + 232 + 4 + 4 + 4),
        // outgoingSequence: int32_le(buffer)(cursor + 232 + 4 + 4 + 4 + 4),
        // reliableSequence: int32_le(buffer)(cursor + 232 + 4 + 4 + 4 + 4 + 4),
        // lastReliableSequence: int32_le(buffer)(cursor + 232 + 4 + 4 + 4 + 4 + 4 + 4),
        // msgLength: msgLength(buffer)(cursor + 232 + 4 + 4 + 4 + 4 + 4 + 4 + 4),
      })
      // E.chain((netMsg) =>
      //   pipe(
      //     msg(buffer)(cursor + 232 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4)(
      //       netMsg.msgLength
      //     ),
      //     E.map((msg) => ({ ...netMsg, msg }))
      //   )
      // )
    );

// const msgLength =
//   (buffer: Buffer) =>
//   (cursor = 0) =>
//     pipe(
//       int32_le(buffer)(cursor),
//       E.chainFirst(
//         E.fromPredicate(
//           (a) => a > 0 && a < 65_536,
//           toError("invalid netmsg length")
//         )
//       )
//     );

// const msg =
//   (buffer: Buffer) =>
//   (cursor = 0) =>
//   (msgLength: number) =>
//     E.tryCatch(
//       () =>
//         buffer.slice(
//           cursor + 232 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4,
//           cursor + 232 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + msgLength
//         ),
//       E.toError
//     );
