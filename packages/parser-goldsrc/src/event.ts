import { buffer as B } from "@talent/parser-buffer";
import { parser as P } from "@talent/parser";
import type { Point } from "./Point";
import { point } from "./Point";
import { sequenceS } from "fp-ts/lib/Apply";

export type Event = {
  readonly flags: number;
  readonly index: number;
  readonly delay: number;
  readonly args: EventArgs;
};

export type EventArgs = {
  readonly flags: number;
  readonly entityIndex: number;
  readonly origin: Point;
  readonly angles: Point;
  readonly velocity: Point;
  readonly ducking: number;
  readonly fparam1: number;
  readonly fparam2: number;
  readonly iparam1: number;
  readonly iparam2: number;
  readonly bparam1: number;
  readonly bparam2: number;
};

export const args: B.BufferParser<EventArgs> = sequenceS(P.Applicative)({
  flags: B.int32_le,
  entityIndex: B.int32_le,
  origin: point,
  angles: point,
  velocity: point,
  ducking: B.int32_le,
  fparam1: B.float32_le,
  fparam2: B.float32_le,
  iparam1: B.int32_le,
  iparam2: B.int32_le,
  bparam1: B.int32_le,
  bparam2: B.int32_le,
});

export const event: B.BufferParser<Event> = sequenceS(P.Applicative)({
  flags: B.int32_le,
  index: B.int32_le,
  delay: B.float32_le,
  args,
});
