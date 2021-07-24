import { either as E } from "fp-ts";
import { sequenceS } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";
import { float32_le, int32_le, point } from "../parser";

export type NetMsg = {
  readonly info: unknown;
  readonly incomingSequence: number;
  readonly incomingAcknowledged: number;
  readonly incomingReliableAcknowledged: number;
  readonly incomingReliableSequence: number;
  readonly outgoingSequence: number;
  readonly reliableSequence: number;
  readonly lastReliableSequence: number;
  readonly msgLength: number;
  readonly msg: unknown;
};

export const netMsg =
  (buffer: Buffer) =>
  (cursor = 0): E.Either<Error, NetMsg> =>
    pipe(
      sequenceS(E.Applicative)({
        info: netMsgInfo(buffer)(cursor),
        incomingSequence: int32_le(buffer)(cursor),
        incomingAcknowledged: int32_le(buffer)(cursor),
        incomingReliableAcknowledged: int32_le(buffer)(cursor),
        incomingReliableSequence: int32_le(buffer)(cursor),
        outgoingSequence: int32_le(buffer)(cursor),
        reliableSequence: int32_le(buffer)(cursor),
        lastReliableSequence: int32_le(buffer)(cursor),
        msgLength: int32_le(buffer)(cursor), // TODO Validate
        msg: E.right({}),
      })
    );

// prettier-ignore
const netMsgInfo =
  (buffer: Buffer) =>
  (cursor = 0) =>
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
    E.sequenceArray([
      int32_le(buffer)(cursor),
      int32_le(buffer)(cursor + 4),
      int32_le(buffer)(cursor + 4 + 4),
      int32_le(buffer)(cursor + 4 + 4 + 4),
    ]);
