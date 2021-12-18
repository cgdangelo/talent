import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";

export type CrosshairAngle = {
  readonly pitch: number;
  readonly yaw: number;
};

export const crosshairAngle: B.BufferParser<CrosshairAngle> = P.struct({
  pitch: B.int16_le,
  yaw: B.int16_le,
});
