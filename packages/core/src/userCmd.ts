import { either as E } from "fp-ts";
import { sequenceS } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "./parser";
import {
  float32_le,
  int16_le,
  int32_le,
  int8_be,
  point,
  uint16_le,
  uint8_be,
} from "./parser";

export type UserCmd = {
  readonly lerpMs: number;
  readonly ms: number;
  readonly viewAngles: Point;
  readonly forwardMove: number;
  readonly sideMove: number;
  readonly upMove: number;
  readonly lightLevel: number;
  readonly buttons: number;
  readonly impulse: number;
  readonly weaponSelect: number;
  readonly impactIndex: number;
  readonly impactPosition: Point;
};

export const userCmd =
  (buffer: Buffer) =>
  (cursor = 0): E.Either<Error, UserCmd> =>
    pipe(
      // prettier-ignore
      sequenceS(E.Applicative)({
        lerpMs:         int16_le    (buffer)(cursor),
        ms:             uint8_be    (buffer)(cursor + 2),
        //              skip 1
        viewAngles:     point       (buffer)(cursor + 2 + 1 + 1),
        forwardMove:    float32_le  (buffer)(cursor + 2 + 1 + 1 + 12),
        sideMove:       float32_le  (buffer)(cursor + 2 + 1 + 1 + 12 + 4),
        upMove:         float32_le  (buffer)(cursor + 2 + 1 + 1 + 12 + 4 + 4),
        lightLevel:     int8_be     (buffer)(cursor + 2 + 1 + 1 + 12 + 4 + 4 + 4),
        //              skip 1
        buttons:        uint16_le   (buffer)(cursor + 2 + 1 + 1 + 12 + 4 + 4 + 4 + 1 + 1),
        impulse:        int8_be     (buffer)(cursor + 2 + 1 + 1 + 12 + 4 + 4 + 4 + 1 + 1 + 2),
        weaponSelect:   int8_be     (buffer)(cursor + 2 + 1 + 1 + 12 + 4 + 4 + 4 + 1 + 1 + 2 + 1),
        //              skip 2
        impactIndex:    int32_le    (buffer)(cursor + 2 + 1 + 1 + 12 + 4 + 4 + 4 + 1 + 1 + 2 + 1 + 1 + 2),
        impactPosition: point       (buffer)(cursor + 2 + 1 + 1 + 12 + 4 + 4 + 4 + 1 + 1 + 2 + 1 + 1 + 2 + 4),
      })
    );
