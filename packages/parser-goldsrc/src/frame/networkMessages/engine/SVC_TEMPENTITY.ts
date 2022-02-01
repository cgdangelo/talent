import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "../../../Point";
import { pointBy } from "../../../Point";
import { MessageType } from "../MessageType";

type TE_DECAL = {
  readonly id: TempEntityType.TE_DECAL;
  readonly name: "TE_DECAL";
  readonly fields: {
    readonly position: Point;
    readonly textureIndex: number;
    readonly entityIndex: number;
  };
};

type TE_BREAKMODEL = {
  readonly id: TempEntityType.TE_BREAKMODEL;
  readonly name: "TE_BREAKMODEL";
  readonly fields: {
    readonly position: Point;
    readonly size: Point;
    readonly velocity: Point;
    readonly velocityRandomness: number;
    readonly objectIndex: number;
    readonly count: number;
    readonly life: number;
    readonly flags: number;
  };
};

type TE_GUNSHOTDECAL = {
  readonly id: TempEntityType.TE_GUNSHOTDECAL;
  readonly name: "TE_GUNSHOTDECAL";
  readonly fields: {
    readonly position: Point;
    readonly entityIndex: number;
    readonly decal: number;
  };
};

type TE_PLAYERDECAL = {
  readonly id: TempEntityType.TE_PLAYERDECAL;
  readonly name: "TE_PLAYERDECAL";
  readonly fields: {
    readonly playerIndex: number;
    readonly position: Point;
    readonly entityIndex: number;
    readonly decalIndex: number;
  };
};

type TE_WORLDDECAL = {
  readonly id: TempEntityType.TE_WORLDDECAL;
  readonly name: "TE_WORLDDECAL";
  readonly fields: {
    readonly position: Point;
    readonly textureIndex: number;
  };
};

type TE_KILLPLAYERATTACHMENTS = {
  readonly id: TempEntityType.TE_KILLPLAYERATTACHMENTS;
  readonly name: "TE_KILLPLAYERATTACHMENTS";
  readonly fields: {
    readonly entityIndex: number;
  };
};

export type TempEntity = {
  readonly id: MessageType.SVC_TEMPENTITY;
  readonly name: "SVC_TEMPENTITY";
  readonly fields:
    | TE_DECAL
    | TE_BREAKMODEL
    | TE_GUNSHOTDECAL
    | TE_PLAYERDECAL
    | TE_WORLDDECAL
    | TE_KILLPLAYERATTACHMENTS;
};

enum TempEntityType {
  TE_BEAMPOINTS = 0,
  TE_BEAMENTPOINT = 1,
  TE_GUNSHOT = 2,
  TE_EXPLOSION = 3,
  TE_TAREXPLOSION = 4,
  TE_SMOKE = 5,
  TE_TRACER = 6,
  TE_LIGHTNING = 7,
  TE_BEAMENTS = 8,
  TE_SPARKS = 9,
  TE_LAVASPLASH = 10,
  TE_TELEPORT = 11,
  TE_EXPLOSION2 = 12,
  TE_BSPDECAL = 13,
  TE_IMPLOSION = 14,
  TE_SPRITETRAIL = 15,
  TE_SPRITE = 17,
  TE_BEAMSPRITE = 18,
  TE_BEAMTORUS = 19,
  TE_BEAMDISK = 20,
  TE_BEAMCYLINDER = 21,
  TE_BEAMFOLLOW = 22,
  TE_GLOWSPRITE = 23,
  TE_BEAMRING = 24,
  TE_STREAK_SPLASH = 25,
  TE_DLIGHT = 27,
  TE_ELIGHT = 28,
  TE_TEXTMESSAGE = 29,
  TE_LINE = 30,
  TE_BOX = 31,
  TE_KILLBEAM = 99,
  TE_LARGEFUNNEL = 100,
  TE_BLOODSTREAM = 101,
  TE_SHOWLINE = 102,
  TE_BLOOD = 103,
  TE_DECAL = 104,
  TE_FIZZ = 105,
  TE_MODEL = 106,
  TE_EXPLODEMODEL = 107,
  TE_BREAKMODEL = 108,
  TE_GUNSHOTDECAL = 109,
  TE_SPRITE_SPRAY = 110,
  TE_ARMOR_RICOCHET = 111,
  TE_PLAYERDECAL = 112,
  TE_BUBBLES = 113,
  TE_BUBBLETRAIL = 114,
  TE_BLOODSPRITE = 115,
  TE_WORLDDECAL = 116,
  TE_WORLDDECALHIGH = 117,
  TE_DECALHIGH = 118,
  TE_PROJECTILE = 119,
  TE_SPRAY = 120,
  TE_PLAYERSPRITES = 121,
  TE_PARTICLEBURST = 122,
  TE_FIREFIELD = 123,
  TE_PLAYERATTACHMENT = 124,
  TE_KILLPLAYERATTACHMENTS = 125,
  TE_MULTIGUNSHOT = 126,
  TE_USERTRACER = 127,
}

// https://github.com/FWGS/xash3d-fwgs/blob/master/engine/common/net_buffer.c#L597-L603
const coord: B.BufferParser<Point> = pointBy(
  pipe(
    B.int16_le,
    P.map((a) => a / 8)
  )
);

export const tempEntity: B.BufferParser<TempEntity> = pipe(
  B.uint8_le,
  P.chain((id): B.BufferParser<TempEntity["fields"]> => {
    switch (id) {
      case TempEntityType.TE_DECAL: // 104
        return pipe(
          P.struct({
            position: coord,
            textureIndex: B.uint8_le,
            entityIndex: B.int16_le,
          }),

          P.map((fields) => ({ id, name: "TE_DECAL", fields }))
        );

      case TempEntityType.TE_BREAKMODEL: // 108
        return pipe(
          P.struct({
            position: coord,
            size: coord,
            velocity: coord,
            velocityRandomness: B.uint8_le,
            objectIndex: B.int16_le,
            count: B.uint8_le,
            life: B.uint8_le,
            flags: B.uint8_le,
          }),

          P.map((fields) => ({ id, name: "TE_BREAKMODEL", fields }))
        );

      case TempEntityType.TE_GUNSHOTDECAL: // 109
        return pipe(
          P.struct({
            position: coord,
            entityIndex: B.int16_le,
            decal: B.uint8_le,
          }),

          P.map((fields) => ({ id, name: "TE_GUNSHOTDECAL", fields }))
        );

      case TempEntityType.TE_PLAYERDECAL: // 112
        return pipe(
          P.struct({
            playerIndex: B.uint8_le,
            position: coord,
            entityIndex: B.int16_le,
            decalIndex: B.uint8_le,
            // [optional] short (model index???)
            // modelIndex: B.int16_le,
          }),

          P.map((fields) => ({ id, name: "TE_PLAYERDECAL", fields }))
        );

      case TempEntityType.TE_WORLDDECAL: // 116
        return pipe(
          P.struct({
            position: coord,
            textureIndex: B.uint8_le,
          }),

          P.map((fields) => ({ id, name: "TE_WORLDDECAL", fields }))
        );

      case TempEntityType.TE_KILLPLAYERATTACHMENTS: // 125
        return pipe(
          P.struct({ entityIndex: B.uint8_le }),

          P.map((fields) => ({ id, name: "TE_KILLPLAYERATTACHMENTS", fields }))
        );

      default:
        return P.cut(P.fail());
    }
  }),

  P.map((fields) => ({
    id: MessageType.SVC_TEMPENTITY as const,
    name: "SVC_TEMPENTITY" as const,
    fields,
  }))
);
