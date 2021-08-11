import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { sequenceS } from "fp-ts/lib/Apply";
import { constant, pipe } from "fp-ts/lib/function";
import { clientData } from "./clientData";
import { consoleCommand } from "./consoleCommand";
import { demoBuffer } from "./demoBuffer";
import { event } from "./event";
import { netMsg } from "./netMsg";
import { sound } from "./sound";
import { weaponAnimation } from "./weaponAnimation";

export type FrameType =
  | `NetMsg-${NetMsgFrameType}`
  | "DemoStart"
  | "ConsoleCommand"
  | "ClientData"
  | "NextSection"
  | "Event"
  | "WeaponAnimation"
  | "Sound"
  | "DemoBuffer";

type NetMsgFrameType = "Start" | "Normal" | number;

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
      return "DemoStart";
    case 3:
      return "ConsoleCommand";
    case 4:
      return "ClientData";
    case 5:
      return "NextSection";
    case 6:
      return "Event";
    case 7:
      return "WeaponAnimation";
    case 8:
      return "Sound";
    case 9:
      return "DemoBuffer";
    default:
      return `NetMsg-${netMsgFrameType_(a)}`;
  }
};

const netMsgFrameType_ = (a: number): NetMsgFrameType => {
  switch (a) {
    case 0:
      return "Start";
    case 1:
      return "Normal";
    default:
      return a;
  }
};

const frameType: B.BufferParser<FrameType> = pipe(
  P.sat(
    B.uint8_be,
    (a) => a > 0 && a < 9,
    (a) => `expected frame type id [0, 9], got ${a}`
  ),
  P.map(frameType_)
);

const frameHeader: B.BufferParser<FrameHeader> = sequenceS(P.Applicative)({
  frameType,
  time: B.float32_le,
  frame: B.int32_le,
});

const frame: B.BufferParser<Frame> = pipe(
  frameHeader,
  P.chain((frameHeader) =>
    pipe(
      frameData(frameHeader.frameType),
      P.map((frameData) => ({ frameHeader, frameData }))
    )
  )
);

const frameData: (frameType: FrameType) => B.BufferParser<unknown> = (
  frameType
) => {
  const noFields = P.succeed<Buffer, Record<never, never>>({});

  switch (frameType) {
    case "ClientData":
      return clientData;

    case "ConsoleCommand":
      return consoleCommand;

    case "DemoBuffer":
      return demoBuffer;

    case "DemoStart":
      return noFields;

    case "Event":
      return event;

    case "NextSection":
      return noFields;

    case "Sound":
      return sound;

    case "WeaponAnimation":
      return weaponAnimation;

    default:
      return frameType.startsWith("NetMsg") ? netMsg : P.fail(frameType);
  }
};

export const frames: B.BufferParser<readonly Frame[]> = P.manyTill(
  frame,

  pipe(
    P.sat(frameHeader, (a) => a.frameType === "NextSection", constant(""))

    // TODO Restore the eof check.
  )
);
