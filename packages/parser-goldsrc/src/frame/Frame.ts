import { parser as P, statefulParser as SP } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import type { DemoStateParser } from "../DemoState";
import type { ClientData } from "./ClientData";
import { clientData } from "./ClientData";
import type { ConsoleCommand } from "./ConsoleCommand";
import { consoleCommand } from "./ConsoleCommand";
import type { DemoBuffer } from "./DemoBuffer";
import { demoBuffer } from "./DemoBuffer";
import type { Event } from "./Event";
import { event } from "./Event";
import type { FrameHeader } from "./FrameHeader";
import { frameHeader } from "./FrameHeader";
import type { NetworkMessages } from "./networkMessages/NetworkMessages";
import { networkMessages } from "./networkMessages/NetworkMessages";
import type { Sound } from "./Sound";
import { sound } from "./Sound";
import type { WeaponAnimation } from "./WeaponAnimation";
import { weaponAnimation } from "./WeaponAnimation";

export type Frame =
  | NetworkMessages
  | ConsoleCommand
  | ClientData
  | Event
  | WeaponAnimation
  | Sound
  | DemoBuffer
  | {
      readonly header: FrameHeader;
      readonly type: "DemoStart" | "NextSection";
    };

const frameType: B.BufferParser<number> = P.expected(
  pipe(
    B.uint8_le,
    P.filter((a) => a >= 0 && a <= 9)
  ),
  "frame type id [0, 9]"
);

const frame_: (frameType: number) => DemoStateParser<Frame> = (frameType) => {
  switch (frameType) {
    case 2:
      return SP.lift(
        pipe(
          frameHeader,
          P.bindTo("header"),

          P.bind("type", () => P.of("DemoStart" as const))
        )
      );

    case 3:
      return SP.lift(consoleCommand);

    case 4:
      return SP.lift(clientData);

    case 5:
      return SP.lift(
        pipe(
          frameHeader,
          P.bindTo("header"),

          P.bind("type", () => P.of("DemoStart" as const))
        )
      );

    case 6:
      return SP.lift(event);

    case 7:
      return SP.lift(weaponAnimation);

    case 8:
      return SP.lift(sound);

    case 9:
      return SP.lift(demoBuffer);

    default:
      return networkMessages;
  }
};

const frame = pipe(
  SP.lift(frameType) as DemoStateParser<number>,
  SP.chain(frame_)
);

export const frames: DemoStateParser<readonly Frame[]> = SP.manyTill(
  frame,
  SP.lift(
    pipe(
      frameType,
      P.filter((a) => a === 5)
    )
  )
);
