import { buffer as B, parser as P } from "@talent/parser";
import { sequenceS, sequenceT } from "fp-ts/lib/Apply";

export type RefParams = {
  readonly viewOrigin: B.Point;
  readonly viewAngles: B.Point;
  readonly forward: B.Point;
  readonly right: B.Point;
  readonly up: B.Point;
  readonly frameTime: number;
  readonly time: number;
  readonly intermission: number;
  readonly paused: number;
  readonly spectator: number;
  readonly onGround: number;
  readonly waterLevel: number;
  readonly simVel: B.Point;
  readonly simOrg: B.Point;
  readonly viewHeight: B.Point;
  readonly idealPitch: number;
  readonly cl_viewangles: B.Point;
  readonly health: number;
  readonly crosshairAngle: B.Point;
  readonly viewSize: number;
  readonly punchAngle: B.Point;
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

const viewPort: B.BufferParser<RefParams["viewPort"]> = sequenceT(
  P.Applicative
)(B.int32_le, B.int32_le, B.int32_le, B.int32_le);

export const refParams: B.BufferParser<RefParams> = sequenceS(P.Applicative)({
  viewOrigin: B.point,
  viewAngles: B.point,
  forward: B.point,
  right: B.point,
  up: B.point,
  frameTime: B.float32_le,
  time: B.float32_le,
  intermission: B.int32_le,
  paused: B.int32_le,
  spectator: B.int32_le,
  onGround: B.int32_le,
  waterLevel: B.int32_le,
  simVel: B.point,
  simOrg: B.point,
  viewHeight: B.point,
  idealPitch: B.float32_le,
  cl_viewangles: B.point,
  health: B.int32_le,
  crosshairAngle: B.point,
  viewSize: B.float32_le,
  punchAngle: B.point,
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
