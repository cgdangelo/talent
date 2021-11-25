import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";

export type CrosshairAngle = {
  readonly pitch: number;
  readonly yaw: number;
};

export const crosshairAngle: B.BufferParser<CrosshairAngle> =
  // TODO hlviewer does not scale these. Find out what "engine call" means
  // here: https://wiki.alliedmods.net/Half-Life_1_Engine_Messages#SVC_CROSSHAIRANGLE
  pipe(
    P.tuple(B.int16_le, B.int16_le),
    P.map(([pitch, yaw]) => ({ pitch, yaw }))
  );
