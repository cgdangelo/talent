import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";
import type { FrameHeader } from "./FrameHeader";
import { frameHeader } from "./FrameHeader";

export type WeaponAnimation = {
  readonly header: FrameHeader;
  readonly type: "WeaponAnimation";
  readonly frameData: {
    readonly animation: number;
    readonly body: number;
  };
};

export const weaponAnimation: B.BufferParser<WeaponAnimation> = pipe(
  frameHeader,
  P.bindTo("header"),

  P.bind("type", () => P.of("WeaponAnimation" as const)),

  P.bind("frameData", () =>
    P.struct({
      animation: B.int32_le,
      body: B.int32_le,
    })
  )
);
