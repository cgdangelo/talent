import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { sequenceS } from "fp-ts/lib/Apply";
import { constant, pipe } from "fp-ts/lib/function";
import { clientData } from "./ClientData";
import { consoleCommand } from "./ConsoleCommand";
import { demoBuffer } from "./DemoBuffer";
import { event } from "./Event";
import type { NetMsgFrameType } from "./NetMsg";
import { netMsg, netMsgFrameType } from "./NetMsg";
import { sound } from "./Sound";
import { weaponAnimation } from "./WeaponAnimation";

export type Frame = {
  readonly header: FrameHeader;
  readonly frameData: unknown;
};

export type FrameHeader = {
  readonly frameType: FrameType;
  readonly time: number;
  readonly frame: number;
};

export type FrameType =
  | "ClientData"
  | "ConsoleCommand"
  | "DemoBuffer"
  | "DemoStart"
  | "Event"
  | "NextSection"
  | "Sound"
  | "WeaponAnimation"
  | `NetMsg-${NetMsgFrameType}`;

const frameTypeIdToName = (a: number): FrameType => {
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
      return `NetMsg-${netMsgFrameType(a)}`;
  }
};

const frameType: B.BufferParser<FrameType> = pipe(
  P.sat(
    B.uint8_be,
    (a) => a >= 0 && a <= 9,
    (a) => `expected frame type id [0, 9], got ${a}`
  ),
  P.map(frameTypeIdToName)
);

const frameHeader: B.BufferParser<FrameHeader> = sequenceS(P.Applicative)({
  frameType,
  time: B.float32_le,
  frame: B.int32_le,
});

const frameData: (frameType: FrameType) => B.BufferParser<unknown> = (
  frameType
) => {
  const noFields: B.BufferParser<Record<never, never>> = P.of({});

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

const frame: B.BufferParser<Frame> = pipe(
  frameHeader,
  P.chain((header) =>
    pipe(
      frameData(header.frameType),
      P.map((frameData) => ({ header, frameData }))
    )
  )
);

export const frames: B.BufferParser<readonly Frame[]> = P.manyTill(
  frame,
  P.sat(frameType, (a) => a === "NextSection", constant(""))
);
