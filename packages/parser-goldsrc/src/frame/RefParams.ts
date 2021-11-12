import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import type { Point } from "../Point";
import { point } from "../Point";

export type RefParams = {
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
  readonly viewPort: readonly [
    _: number,
    _: number,
    width: number,
    height: number
  ];
  readonly nextView: number;
  readonly onlyClientDraw: number;
};

const viewPort: B.BufferParser<RefParams["viewPort"]> = P.tuple(
  B.int32_le,
  B.int32_le,
  B.int32_le,
  B.int32_le
);

export const refParams: B.BufferParser<RefParams> = P.struct({
  viewOrigin: point,
  viewAngles: point,
  forward: point,
  right: point,
  up: point,
  frameTime: B.float32_le,
  time: B.float32_le,
  intermission: B.int32_le,
  paused: B.int32_le,
  spectator: B.int32_le,
  onGround: B.int32_le,
  waterLevel: B.int32_le,
  simVel: point,
  simOrg: point,
  viewHeight: point,
  idealPitch: B.float32_le,
  cl_viewangles: point,
  health: B.int32_le,
  crosshairAngle: point,
  viewSize: B.float32_le,
  punchAngle: point,
  maxClients: B.int32_le,
  viewEntity: B.int32_le,
  playerNum: B.int32_le,
  maxEntities: B.int32_le,
  demoPlayback: B.int32_le,
  hardware: B.int32_le,
  smoothing: B.int32_le,
  ptrCmd: B.int32_le,
  ptrMoveVars: B.int32_le,
  viewPort,
  nextView: B.int32_le,
  onlyClientDraw: B.int32_le,
});
