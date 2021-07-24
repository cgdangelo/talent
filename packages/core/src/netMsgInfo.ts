import { either as E } from "fp-ts";
import { sequenceS, sequenceT } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "./parser";
import { float32_le, int32_le, point } from "./parser";

export type NetMsgInfo = {
  readonly timestamp: number;
  readonly viewOrigin: Point;
  readonly viewAngles: Point;
  readonly forward: Point;
  readonly right: Point;
  readonly up: Point;
  readonly frameTime: number;
  readonly time: number;
  readonly intermission: number;
  readonly paused: number;
  readonly spectator: number;
  readonly onGround: number;
  readonly waterLevel: number;
  readonly simVel: Point;
  readonly simOrg: Point;
  readonly viewHeight: Point;
  readonly idealPitch: number;
  readonly cl_viewangles: Point;
  readonly health: number;
  readonly crosshairAngle: Point;
  readonly viewSize: number;
  readonly punchAngle: Point;
  readonly maxClients: number;
  readonly viewEntity: number;
  readonly playerNum: number;
  readonly maxEntities: number;
  readonly demoPlayback: number;
  readonly hardware: number;
  readonly smoothing: number;
  readonly ptrCmd: number;
  readonly ptrMoveVars: number;
  readonly viewPort: readonly [number, number, number, number];
  readonly nextView: number;
  readonly onlyClientDraw: number;
};

// prettier-ignore
export const netMsgInfo =
  (buffer: Buffer) =>
  (cursor = 0): E.Either<Error, NetMsgInfo> =>
    pipe(
      sequenceS(E.Applicative)({
        timestamp:      float32_le  (buffer)(cursor),
        viewOrigin:     point       (buffer)(cursor + 4),
        viewAngles:     point       (buffer)(cursor + 4 + 12),
        forward:        point       (buffer)(cursor + 4 + 12 + 12),
        right:          point       (buffer)(cursor + 4 + 12 + 12 + 12),
        up:             point       (buffer)(cursor + 4 + 12 + 12 + 12 + 12),
        frameTime:      float32_le  (buffer)(cursor + 4 + 12 + 12 + 12 + 12 + 12),
        time:           float32_le  (buffer)(cursor + 4 + 12 + 12 + 12 + 12 + 12 + 4),
        intermission:   int32_le    (buffer)(cursor + 4 + 12 + 12 + 12 + 12 + 12 + 4 + 4),
        paused:         int32_le    (buffer)(cursor + 4 + 12 + 12 + 12 + 12 + 12 + 4 + 4 + 4),
        spectator:      int32_le    (buffer)(cursor + 4 + 12 + 12 + 12 + 12 + 12 + 4 + 4 + 4 + 4),
        onGround:       int32_le    (buffer)(cursor + 4 + 12 + 12 + 12 + 12 + 12 + 4 + 4 + 4 + 4 + 4),
        waterLevel:     int32_le    (buffer)(cursor + 4 + 12 + 12 + 12 + 12 + 12 + 4 + 4 + 4 + 4 + 4 + 4),
        simVel:         point       (buffer)(cursor + 4 + 12 + 12 + 12 + 12 + 12 + 4 + 4 + 4 + 4 + 4 + 4 + 4),
        simOrg:         point       (buffer)(cursor + 4 + 12 + 12 + 12 + 12 + 12 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 12),
        viewHeight:     point       (buffer)(cursor + 4 + 12 + 12 + 12 + 12 + 12 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 12 + 12),
        idealPitch:     float32_le  (buffer)(cursor + 4 + 12 + 12 + 12 + 12 + 12 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 12 + 12 + 12),
        cl_viewangles:  point       (buffer)(cursor + 4 + 12 + 12 + 12 + 12 + 12 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 12 + 12 + 12 + 4),
        health:         int32_le    (buffer)(cursor + 4 + 12 + 12 + 12 + 12 + 12 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 12 + 12 + 12 + 4 + 12),
        crosshairAngle: point       (buffer)(cursor + 4 + 12 + 12 + 12 + 12 + 12 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 12 + 12 + 12 + 4 + 12 + 4),
        viewSize:       float32_le  (buffer)(cursor + 4 + 12 + 12 + 12 + 12 + 12 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 12 + 12 + 12 + 4 + 12 + 4 + 12),
        punchAngle:     point       (buffer)(cursor + 4 + 12 + 12 + 12 + 12 + 12 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 12 + 12 + 12 + 4 + 12 + 4 + 12 + 4),
        maxClients:     int32_le    (buffer)(cursor + 4 + 12 + 12 + 12 + 12 + 12 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 12 + 12 + 12 + 4 + 12 + 4 + 12 + 4 + 12),
        viewEntity:     int32_le    (buffer)(cursor + 4 + 12 + 12 + 12 + 12 + 12 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 12 + 12 + 12 + 4 + 12 + 4 + 12 + 4 + 12 + 4),
        playerNum:      int32_le    (buffer)(cursor + 4 + 12 + 12 + 12 + 12 + 12 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 12 + 12 + 12 + 4 + 12 + 4 + 12 + 4 + 12 + 4 + 4),
        maxEntities:    int32_le    (buffer)(cursor + 4 + 12 + 12 + 12 + 12 + 12 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 12 + 12 + 12 + 4 + 12 + 4 + 12 + 4 + 12 + 4 + 4 + 4),
        demoPlayback:   int32_le    (buffer)(cursor + 4 + 12 + 12 + 12 + 12 + 12 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 12 + 12 + 12 + 4 + 12 + 4 + 12 + 4 + 12 + 4 + 4 + 4 + 4),
        hardware:       int32_le    (buffer)(cursor + 4 + 12 + 12 + 12 + 12 + 12 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 12 + 12 + 12 + 4 + 12 + 4 + 12 + 4 + 12 + 4 + 4 + 4 + 4 + 4),
        smoothing:      int32_le    (buffer)(cursor + 4 + 12 + 12 + 12 + 12 + 12 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 12 + 12 + 12 + 4 + 12 + 4 + 12 + 4 + 12 + 4 + 4 + 4 + 4 + 4 + 4),
        ptrCmd:         int32_le    (buffer)(cursor + 4 + 12 + 12 + 12 + 12 + 12 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 12 + 12 + 12 + 4 + 12 + 4 + 12 + 4 + 12 + 4 + 4 + 4 + 4 + 4 + 4 + 4),
        ptrMoveVars:    int32_le    (buffer)(cursor + 4 + 12 + 12 + 12 + 12 + 12 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 12 + 12 + 12 + 4 + 12 + 4 + 12 + 4 + 12 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4),
        viewPort:       viewPort    (buffer)(cursor + 4 + 12 + 12 + 12 + 12 + 12 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 12 + 12 + 12 + 4 + 12 + 4 + 12 + 4 + 12 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4),
        nextView:       int32_le    (buffer)(cursor + 4 + 12 + 12 + 12 + 12 + 12 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 12 + 12 + 12 + 4 + 12 + 4 + 12 + 4 + 12 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 16),
        onlyClientDraw: int32_le    (buffer)(cursor + 4 + 12 + 12 + 12 + 12 + 12 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 12 + 12 + 12 + 4 + 12 + 4 + 12 + 4 + 12 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 16 + 4),
      })
    );

const viewPort =
  (buffer: Buffer) =>
  (cursor = 0) =>
    sequenceT(E.Applicative)(
      int32_le(buffer)(cursor),
      int32_le(buffer)(cursor + 4),
      int32_le(buffer)(cursor + 4 + 4),
      int32_le(buffer)(cursor + 4 + 4 + 4)
    );
