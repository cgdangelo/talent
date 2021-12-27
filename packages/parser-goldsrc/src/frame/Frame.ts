import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";
import { clientData } from "./ClientData";
import { consoleCommand } from "./ConsoleCommand";
import { demoBuffer } from "./DemoBuffer";
import { event } from "./Event";
import type { NetworkMessagesFrameType } from "./networkMessages/NetworkMessages";
import {
  networkMessages,
  networkMessagesFrameType,
} from "./networkMessages/NetworkMessages";
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
  | `NetworkMessages-${NetworkMessagesFrameType}`
  | "DemoStart"
  | "ConsoleCommand"
  | "ClientData"
  | "NextSection"
  | "Event"
  | "WeaponAnimation"
  | "Sound"
  | "DemoBuffer";

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
      return `NetworkMessages-${networkMessagesFrameType(a)}`;
  }
};

const frameType: B.BufferParser<FrameType> = P.expected(
  pipe(
    B.uint8_le,
    P.filter((a) => a >= 0 && a <= 9),
    P.map(frameTypeIdToName)
  ),
  "frame type id [0, 9]"
);

const frameHeader: B.BufferParser<FrameHeader> = P.struct({
  frameType,
  time: B.float32_le,
  frame: B.uint32_le,
});

const frameData: (frameType: FrameType) => B.BufferParser<unknown> = (
  frameType
) => {
  const noFields: B.BufferParser<Record<never, never>> = P.of({});

  switch (frameType) {
    case "DemoStart":
      return noFields;

    case "ConsoleCommand":
      return consoleCommand;

    case "ClientData":
      return clientData;

    case "NextSection":
      return noFields;

    case "Event":
      return event;

    case "WeaponAnimation":
      return weaponAnimation;

    case "Sound":
      return sound;

    case "DemoBuffer":
      return demoBuffer;

    default:
      return frameType.startsWith("NetworkMessages")
        ? networkMessages
        : P.fail();
  }
};

const frame: B.BufferParser<Frame> = pipe(
  frameHeader,
  P.bindTo("header"),
  P.bind("frameData", ({ header: { frameType } }) => frameData(frameType))
);

export const frames: B.BufferParser<readonly Frame[]> = P.manyTill(
  frame,
  pipe(
    frameType,
    P.filter((a) => a === "NextSection")
  )
);
