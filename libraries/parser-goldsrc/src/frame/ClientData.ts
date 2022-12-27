import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "../Point";
import { point } from "../Point";
import type { FrameHeader } from "./FrameHeader";
import { frameHeader } from "./FrameHeader";

export type ClientData = {
  readonly header: FrameHeader;
  readonly type: "ClientData";
  readonly frameData: {
    readonly origin: Point;
    readonly viewAngles: Point;
    readonly weaponBits: number;
    readonly fov: number;
  };
};

export const clientData: B.BufferParser<ClientData> = pipe(
  frameHeader,
  P.bindTo("header"),

  P.bind("type", () => P.of("ClientData" as const)),

  P.bind("frameData", () =>
    P.struct({
      origin: point,
      viewAngles: point,
      weaponBits: B.uint32_le,
      fov: B.float32_le,
    })
  )
);
