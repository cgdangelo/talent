import { parser as P, statefulParser as SP } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import type { DemoState, DemoStateParser } from "../DemoState";
import { clientData } from "./ClientData";
import { consoleCommand } from "./ConsoleCommand";
import { demoBuffer } from "./DemoBuffer";
import { event } from "./Event";
import { networkMessages } from "./networkMessages/NetworkMessages";
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
  | "NetworkMessages"
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
      return "NetworkMessages";
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

const frameData: (frameType: FrameType) => DemoStateParser<unknown> = (
  frameType
) => {
  const noFields: DemoStateParser<Record<never, never>> = SP.of({});

  switch (frameType) {
    case "DemoStart":
      return noFields;

    case "ConsoleCommand":
      return SP.lift(consoleCommand);

    case "ClientData":
      return SP.lift(clientData);

    case "NextSection":
      return noFields;

    case "Event":
      return SP.lift(event);

    case "WeaponAnimation":
      return SP.lift(weaponAnimation);

    case "Sound":
      return SP.lift(sound);

    case "DemoBuffer":
      return SP.lift(demoBuffer);

    default:
      return frameType.startsWith("NetworkMessages")
        ? networkMessages
        : SP.lift(P.fail());
  }
};

const frame: DemoStateParser<Frame> = pipe(
  SP.lift<number, FrameHeader, DemoState>(frameHeader),
  SP.bindTo("header"),
  SP.bind("frameData", ({ header: { frameType } }) => frameData(frameType))
);

export const frames: DemoStateParser<readonly Frame[]> = SP.manyTill(
  frame,
  SP.lift(
    pipe(
      frameType,
      P.filter((a) => a === "NextSection")
    )
  )
);
