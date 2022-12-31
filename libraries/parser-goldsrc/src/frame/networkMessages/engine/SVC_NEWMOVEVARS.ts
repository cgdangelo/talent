import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import * as P from '@cgdangelo/talent-parser/lib/Parser';
import { pipe } from 'fp-ts/lib/function';
import { point } from '../../../Point';
import type { MoveVars } from '../MoveVars';
import { MessageType } from '../MessageType';

// TODO sky stuff is at the bottom unlike moveVars parser unfortunately, but
// structure is the same.
export type NewMoveVars = {
  readonly id: MessageType.SVC_NEWMOVEVARS;
  readonly name: 'SVC_NEWMOVEVARS';

  readonly fields: MoveVars;
};

export const newMoveVars: B.BufferParser<NewMoveVars> = pipe(
  P.struct({
    gravity: B.float32_le,
    stopSpeed: B.float32_le,
    maxSpeed: B.float32_le,
    spectatorMaxSpeed: B.float32_le,
    accelerate: B.float32_le,
    airAccelerate: B.float32_le,
    waterAccelerate: B.float32_le,
    friction: B.float32_le,
    edgeFriction: B.float32_le,
    waterFriction: B.float32_le,
    entGravity: B.float32_le,
    bounce: B.float32_le,
    stepSize: B.float32_le,
    maxVelocity: B.float32_le,
    zMax: B.float32_le,
    waveHeight: B.float32_le,
    footsteps: B.int8_le,
    rollAngle: B.float32_le,
    rollSpeed: B.float32_le,
    skyColor: pipe(
      point,
      P.map(({ x: r, y: g, z: b }) => ({ r, g, b }))
    ),
    skyVec: point,
    skyName: B.ztstr
  }),

  P.map((fields) => ({
    id: MessageType.SVC_NEWMOVEVARS,
    name: 'SVC_NEWMOVEVARS',
    fields
  }))
);
