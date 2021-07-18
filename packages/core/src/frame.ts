import { either as E } from "fp-ts";
import { sequenceS } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";
import { uint8_be } from "./parser";
import { toError } from "./utils";

type FrameType =
  | "netmsg"
  | "start"
  | "console"
  | "client"
  | "next"
  | "event"
  | "weapon"
  | "sound"
  | "buffer";

export type Header = {
  readonly type: FrameType;
  readonly time: number;
  readonly frame: number;
};

export type Frame = {
  readonly header: Header;
  readonly data: unknown;
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
      return "netmsg";
  }
};

const frameType =
  (buffer: Buffer) =>
  (cursor = 0) =>
    pipe(
      uint8_be(buffer)(cursor),
      E.chain(
        E.fromPredicate((a) => a >= 1 && a <= 9, toError("invalid frame type"))
      ),
      E.map(frameType_)
    );

const frameHeader =
  (buffer: Buffer) =>
  (cursor = 0) =>
    sequenceS(E.Applicative)({
      type: frameType(buffer)(cursor),
      time: E.of(0),
      frame: E.of(0),
    });

const frame =
  (buffer: Buffer) =>
  (cursor = 0) =>
    sequenceS(E.Applicative)({
      header: frameHeader(buffer)(cursor),
      data: E.of(undefined),
    });

export const frames =
  (buffer: Buffer) =>
  (cursor = 0): E.Either<Error, readonly Frame[]> =>
    E.sequenceArray([frame(buffer)(cursor)]);
