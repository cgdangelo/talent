import { either as E } from "fp-ts";
import { sequenceS } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";
import { netMsg } from "./netMsg";
import { float32_le, int32_le, uint8_be } from "./parser";
import { toError } from "./utils";

export type FrameType =
  | `netmsg-${NetMsgFrameType}`
  | "start"
  | "console"
  | "client"
  | "next"
  | "event"
  | "weapon"
  | "sound"
  | "buffer";

type NetMsgFrameType = "start" | "normal" | `unknown-${number}`;

export type FrameHeader = {
  readonly frameType: FrameType;
  readonly time: number;
  readonly frame: number;
};

export type Frame = {
  readonly frameHeader: FrameHeader;
  readonly frameData: unknown;
};

const frameType_ = (a: number): FrameType => {
  switch (a) {
    case 2:
      return "start";
    case 3:
      return "console";
    case 4:
      return "client";
    case 5:
      return "next";
    case 6:
      return "event";
    case 7:
      return "weapon";
    case 8:
      return "sound";
    case 9:
      return "buffer";
    default:
      return `netmsg-${netMsgFrameType_(a)}`;
  }
};

const netMsgFrameType_ = (a: number): NetMsgFrameType => {
  switch (a) {
    case 0:
      return "start";
    case 1:
      return "normal";
    default:
      return `unknown-${a}`;
  }
};

const frameType =
  (buffer: Buffer) =>
  (cursor = 0) =>
    pipe(
      uint8_be(buffer)(cursor),
      E.chain(E.fromPredicate((a) => a <= 9, toError("invalid frame type"))),
      E.map(frameType_)
    );

const frameHeader =
  (buffer: Buffer) =>
  (cursor = 0) =>
    sequenceS(E.Applicative)({
      frameType: frameType(buffer)(cursor),
      time: float32_le(buffer)(cursor + 1),
      frame: int32_le(buffer)(cursor + 1 + 4),
    });

const frame =
  (buffer: Buffer) =>
  (cursor = 0) =>
    pipe(
      frameHeader(buffer)(cursor),
      E.chain((frameHeader) =>
        pipe(
          frameData(buffer)(cursor + 1 + 4 + 4)(frameHeader.frameType),
          E.map((frameData) => ({ frameHeader, frameData }))
        )
      )
      // TODO Repeat until frameNextSection
    );

const frameData =
  (buffer: Buffer) =>
  (cursor = 0) =>
  (frameType: FrameType): E.Either<Error, unknown> => {
    switch (frameType) {
      case "netmsg-normal":
        return E.right("foo");

      case "netmsg-start":
        return netMsg(buffer)(cursor);

      default:
        return frameType.startsWith("netmsg-unknown")
          ? E.right("baz")
          : E.right(frameType);
    }
  };

export const frames =
  (buffer: Buffer) =>
  (cursor = 0): E.Either<Error, readonly Frame[]> =>
    E.sequenceArray([frame(buffer)(cursor)]);
