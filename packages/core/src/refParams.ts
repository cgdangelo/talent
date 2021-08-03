import * as P from "@talent/parser";
import { sequenceS, sequenceT } from "fp-ts/lib/Apply";

export type RefParams = {
  readonly viewOrigin: P.Point;
  readonly viewAngles: P.Point;
  readonly forward: P.Point;
  readonly right: P.Point;
  readonly up: P.Point;
  readonly frameTime: number;
  readonly time: number;
  readonly intermission: number;
  readonly paused: number;
  readonly spectator: number;
  readonly onGround: number;
  readonly waterLevel: number;
  readonly simVel: P.Point;
  readonly simOrg: P.Point;
  readonly viewHeight: P.Point;
  readonly idealPitch: number;
  readonly cl_viewangles: P.Point;
  readonly health: number;
  readonly crosshairAngle: P.Point;
  readonly viewSize: number;
  readonly punchAngle: P.Point;
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

const viewPort: P.Parser<Buffer, readonly [number, number, number, number]> =
  sequenceT(P.Applicative)(P.int32_le, P.int32_le, P.int32_le, P.int32_le);

export const refParams: P.Parser<Buffer, RefParams> = sequenceS(P.Applicative)({
  viewOrigin: P.point,
  viewAngles: P.point,
  forward: P.point,
  right: P.point,
  up: P.point,
  frameTime: P.float32_le,
  time: P.float32_le,
  intermission: P.int32_le,
  paused: P.int32_le,
  spectator: P.int32_le,
  onGround: P.int32_le,
  waterLevel: P.int32_le,
  simVel: P.point,
  simOrg: P.point,
  viewHeight: P.point,
  idealPitch: P.float32_le,
  cl_viewangles: P.point,
  health: P.int32_le,
  crosshairAngle: P.point,
  viewSize: P.float32_le,
  punchAngle: P.point,
  maxClients: P.int32_le,
  viewEntity: P.int32_le,
  playerNum: P.int32_le,
  maxEntities: P.int32_le,
  demoPlayback: P.int32_le,
  hardware: P.int32_le,
  smoothing: P.int32_le,
  ptrCmd: P.int32_le,
  ptrMoveVars: P.int32_le,
  viewPort,
  nextView: P.int32_le,
  onlyClientDraw: P.int32_le,
});
