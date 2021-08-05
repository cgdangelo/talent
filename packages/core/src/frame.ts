import { parser as P } from "@talent/parser";
import { sequenceS } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";
import { netMsg } from "./netMsg";
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

const frameType: P.Parser<Buffer, FrameType> = pipe(
  P.uint8_be,
  P.sat((a) => a <= 9, toError("invalid frame type")),
  P.map(frameType_)
);

const frameHeader: P.Parser<Buffer, FrameHeader> = sequenceS(P.Applicative)({
  frameType,
  time: P.float32_le,
  frame: P.int32_le,
});

const frame: P.Parser<Buffer, Frame> = pipe(
  frameHeader,
  P.chain((frameHeader) =>
    pipe(
      frameData(frameHeader.frameType),
      P.map((frameData) => ({ frameHeader, frameData }))
    )
  )
  // TODO Repeat until frameNextSection
);

const frameData: (frameType: FrameType) => P.Parser<Buffer, unknown> = (
  frameType
) => {
  switch (frameType) {
    case "netmsg-normal":
      return P.of("foo");

    case "netmsg-start":
      return netMsg;

    default:
      return frameType.startsWith("netmsg-unknown")
        ? P.of("baz")
        : P.of(frameType);
  }
};

export const frames: P.Parser<Buffer, readonly Frame[]> = pipe(
  frame,

  // TODO Actually parse the rest.
  P.map((a) => [a])
);
