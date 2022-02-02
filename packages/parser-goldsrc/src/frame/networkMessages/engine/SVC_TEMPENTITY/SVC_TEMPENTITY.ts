import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { absurd, pipe } from "fp-ts/lib/function";
import type { Point } from "../../../../Point";
import { pointBy } from "../../../../Point";
import { MessageType } from "../../MessageType";
import { TempEntityType } from "./TempEntityType";

type TE_BEAMPOINTS = {
  readonly id: TempEntityType.TE_BEAMPOINTS;
  readonly name: "TE_BEAMPOINTS";
  readonly fields: {
    readonly startPosition: Point;
    readonly endPosition: Point;
    readonly spriteIndex: number;
    readonly startFrame: number;
    readonly frameRate: number;
    readonly life: number;
    readonly width: number;
    readonly noise: number;
    readonly color: {
      readonly r: number;
      readonly g: number;
      readonly b: number;
      readonly a: number;
    };
    readonly speed: number;
  };
};

type TE_BEAMENTPOINT = {
  readonly id: TempEntityType.TE_BEAMENTPOINT;
  readonly name: "TE_BEAMENTPOINT";
  readonly fields: {
    readonly startEntity: number;
    readonly endPosition: Point;
    readonly spriteIndex: number;
    readonly startFrame: number;
    readonly frameRate: number;
    readonly life: number;
    readonly width: number;
    readonly noise: number;
    readonly color: {
      readonly r: number;
      readonly g: number;
      readonly b: number;
      readonly a: number;
    };
    readonly speed: number;
  };
};

type TE_GUNSHOT = {
  readonly id: TempEntityType.TE_GUNSHOT;
  readonly name: "TE_GUNSHOT";
  readonly fields: {
    readonly position: Point;
  };
};

type TE_EXPLOSION = {
  readonly id: TempEntityType.TE_EXPLOSION;
  readonly name: "TE_EXPLOSION";
  readonly fields: {
    readonly position: Point;
    readonly spriteIndex: number;
    readonly scale: number;
    readonly frameRate: number;
    readonly flags: number;
  };
};

type TE_TAREXPLOSION = {
  readonly id: TempEntityType.TE_TAREXPLOSION;
  readonly name: "TE_TAREXPLOSION";
  readonly fields: {
    readonly position: Point;
  };
};

type TE_SMOKE = {
  readonly id: TempEntityType.TE_SMOKE;
  readonly name: "TE_SMOKE";
  readonly fields: {
    readonly position: Point;
    readonly spriteIndex: number;
    readonly scale: number;
    readonly frameRate: number;
  };
};

type TE_TRACER = {
  readonly id: TempEntityType.TE_TRACER;
  readonly name: "TE_TRACER";
  readonly fields: {
    readonly startPosition: Point;
    readonly endPosition: Point;
  };
};

type TE_LIGHTNING = {
  readonly id: TempEntityType.TE_LIGHTNING;
  readonly name: "TE_LIGHTNING";
  readonly fields: {
    readonly startPosition: Point;
    readonly endPosition: Point;
    readonly life: number;
    readonly width: number;
    readonly noise: number;
    readonly modelIndex: number;
  };
};

type TE_BEAMENTS = {
  readonly id: TempEntityType.TE_BEAMENTS;
  readonly name: "TE_BEAMENTS";
  readonly fields: {
    readonly startEntity: number;
    readonly endEntity: number;
    readonly spriteIndex: number;
    readonly startFrame: number;
    readonly frameRate: number;
    readonly life: number;
    readonly width: number;
    readonly noise: number;
    readonly color: {
      readonly r: number;
      readonly g: number;
      readonly b: number;
      readonly a: number;
    };
    readonly speed: number;
  };
};

type TE_SPARKS = {
  readonly id: TempEntityType.TE_SPARKS;
  readonly name: "TE_SPARKS";
  readonly fields: {
    readonly position: Point;
  };
};

type TE_LAVASPLASH = {
  readonly id: TempEntityType.TE_LAVASPLASH;
  readonly name: "TE_LAVASPLASH";
  readonly fields: {
    readonly position: Point;
  };
};

type TE_TELEPORT = {
  readonly id: TempEntityType.TE_TELEPORT;
  readonly name: "TE_TELEPORT";
  readonly fields: {
    readonly position: Point;
  };
};

type TE_EXPLOSION2 = {
  readonly id: TempEntityType.TE_EXPLOSION2;
  readonly name: "TE_EXPLOSION2";
  readonly fields: {
    readonly position: Point;
    readonly color: number;
    readonly count: number;
  };
};

type TE_BSPDECAL = {
  readonly id: TempEntityType.TE_BSPDECAL;
  readonly name: "TE_BSPDECAL";
  readonly fields: {
    readonly position: Point;
    readonly decalIndex: number;
    readonly entityIndex: number;
    readonly modelIndex?: number;
  };
};

type TE_IMPLOSION = {
  readonly id: TempEntityType.TE_IMPLOSION;
  readonly name: "TE_IMPLOSION";
  readonly fields: {
    readonly position: Point;
    readonly radius: number;
    readonly count: number;
    readonly life: number;
  };
};

type TE_SPRITETRAIL = {
  readonly id: TempEntityType.TE_SPRITETRAIL;
  readonly name: "TE_SPRITETRAIL";
  readonly fields: {
    readonly startPosition: Point;
    readonly endPosition: Point;
    readonly spriteIndex: number;
    readonly count: number;
    readonly life: number;
    readonly scale: number;
    readonly velocity: number;
    readonly velocityRandomness: number;
  };
};

type TE_SPRITE = {
  readonly id: TempEntityType.TE_SPRITE;
  readonly name: "TE_SPRITE";
  readonly fields: {
    readonly position: Point;
    readonly spriteIndex: number;
    readonly scale: number;
    readonly brightness: number;
  };
};

type TE_BEAMSPRITE = {
  readonly id: TempEntityType.TE_BEAMSPRITE;
  readonly name: "TE_BEAMSPRITE";
  readonly fields: {
    readonly startPosition: Point;
    readonly endPosition: Point;
    readonly beamSpriteIndex: number;
    readonly endSpriteIndex: number;
  };
};

type TE_BEAMTORUS = {
  readonly id: TempEntityType.TE_BEAMTORUS;
  readonly name: "TE_BEAMTORUS";
  readonly fields: {
    readonly position: Point;
    readonly axis: Point;
    readonly spriteIndex: number;
    readonly startFrame: number;
    readonly frameRate: number;
    readonly life: number;
    readonly width: number;
    readonly noise: number;
    readonly color: {
      readonly r: number;
      readonly g: number;
      readonly b: number;
      readonly a: number;
    };
    readonly speed: number;
  };
};

type TE_BEAMDISK = {
  readonly id: TempEntityType.TE_BEAMDISK;
  readonly name: "TE_BEAMDISK";
  readonly fields: {
    readonly position: Point;
    readonly axis: Point;
    readonly spriteIndex: number;
    readonly startFrame: number;
    readonly frameRate: number;
    readonly life: number;
    readonly width: number;
    readonly noise: number;
    readonly color: {
      readonly r: number;
      readonly g: number;
      readonly b: number;
      readonly a: number;
    };
    readonly speed: number;
  };
};

type TE_BEAMCYLINDER = {
  readonly id: TempEntityType.TE_BEAMCYLINDER;
  readonly name: "TE_BEAMCYLINDER";
  readonly fields: {
    readonly position: Point;
    readonly axis: Point;
    readonly spriteIndex: number;
    readonly startFrame: number;
    readonly frameRate: number;
    readonly life: number;
    readonly width: number;
    readonly noise: number;
    readonly color: {
      readonly r: number;
      readonly g: number;
      readonly b: number;
      readonly a: number;
    };
    readonly speed: number;
  };
};

type TE_BEAMFOLLOW = {
  readonly id: TempEntityType.TE_BEAMFOLLOW;
  readonly name: "TE_BEAMFOLLOW";
  readonly fields: {
    readonly startEntity: number;
    readonly spriteIndex: number;
    readonly life: number;
    readonly width: number;
    readonly color: {
      readonly r: number;
      readonly g: number;
      readonly b: number;
      readonly a: number;
    };
  };
};

type TE_GLOWSPRITE = {
  readonly id: TempEntityType.TE_GLOWSPRITE;
  readonly name: "TE_GLOWSPRITE";
  readonly fields: {
    readonly position: Point;
    readonly modelIndex: number;
    readonly scale: number;
    readonly size: number;
    readonly brightness: number;
  };
};

type TE_BEAMRING = {
  readonly id: TempEntityType.TE_BEAMRING;
  readonly name: "TE_BEAMRING";
  readonly fields: {
    readonly startEntity: number;
    readonly endEntity: number;
    readonly spriteIndex: number;
    readonly startFrame: number;
    readonly frameRate: number;
    readonly life: number;
    readonly width: number;
    readonly noise: number;
    readonly color: {
      readonly r: number;
      readonly g: number;
      readonly b: number;
      readonly a: number;
    };
    readonly speed: number;
  };
};

type TE_STREAK_SPLASH = {
  readonly id: TempEntityType.TE_STREAK_SPLASH;
  readonly name: "TE_STREAK_SPLASH";
  readonly fields: {
    readonly startPosition: Point;
    readonly vector: Point;
    readonly color: number;
    readonly count: number;
    readonly velocity: number;
    readonly velocityRandomness: number;
  };
};

type TE_DLIGHT = {
  readonly id: TempEntityType.TE_DLIGHT;
  readonly name: "TE_DLIGHT";
  readonly fields: {
    readonly position: Point;
    readonly radius: number;
    readonly color: {
      readonly r: number;
      readonly g: number;
      readonly b: number;
    };
    readonly life: number;
    readonly decayRate: number;
  };
};

type TE_ELIGHT = {
  readonly id: TempEntityType.TE_ELIGHT;
  readonly name: "TE_ELIGHT";
  readonly fields: {
    readonly entityIndex: number;
    readonly position: Point;
    readonly radius: number;
    readonly color: {
      readonly r: number;
      readonly g: number;
      readonly b: number;
    };
    readonly life: number;
    readonly decayRate: number;
  };
};

enum TE_TEXTMESSAGE_FX {
  FadeInOut = 0,
  Credits = 1 << 0,
  WriteOut = 1 << 1,
}

type TE_TEXTMESSAGE = {
  readonly id: TempEntityType.TE_TEXTMESSAGE;
  readonly name: "TE_TEXTMESSAGE";
  readonly fields: {
    readonly channel: number;
    readonly position: {
      readonly x: number;
      readonly y: number;
    };
    readonly effect: TE_TEXTMESSAGE_FX;
    readonly textColor: {
      readonly r: number;
      readonly g: number;
      readonly b: number;
      readonly a: number;
    };
    readonly effectColor: {
      readonly r: number;
      readonly g: number;
      readonly b: number;
      readonly a: number;
    };
    readonly fadeIn: number;
    readonly fadeOut: number;
    readonly hold: number;
    readonly fxTime?: number;
    readonly textMessage: string;
  };
};

type TE_LINE = {
  readonly id: TempEntityType.TE_LINE;
  readonly name: "TE_LINE";
  readonly fields: {
    readonly startPosition: Point;
    readonly endPosition: Point;
    readonly life: number;
    readonly color: {
      readonly r: number;
      readonly g: number;
      readonly b: number;
    };
  };
};

type TE_BOX = {
  readonly id: TempEntityType.TE_BOX;
  readonly name: "TE_BOX";
  readonly fields: {
    readonly startPosition: Point;
    readonly endPosition: Point;
    readonly life: number;
    readonly color: {
      readonly r: number;
      readonly g: number;
      readonly b: number;
    };
  };
};

type TE_KILLBEAM = {
  readonly id: TempEntityType.TE_KILLBEAM;
  readonly name: "TE_KILLBEAM";
  readonly fields: {
    readonly entityIndex: number;
  };
};

type TE_LARGEFUNNEL = {
  readonly id: TempEntityType.TE_LARGEFUNNEL;
  readonly name: "TE_LARGEFUNNEL";
  readonly fields: {
    readonly position: Point;
    readonly modelIndex: number;
    readonly flags: number;
  };
};

type TE_BLOODSTREAM = {
  readonly id: TempEntityType.TE_BLOODSTREAM;
  readonly name: "TE_BLOODSTREAM";
  readonly fields: {
    readonly position: Point;
    readonly vector: Point;
    readonly color: number;
    readonly count: number;
  };
};

type TE_SHOWLINE = {
  readonly id: TempEntityType.TE_SHOWLINE;
  readonly name: "TE_SHOWLINE";
  readonly fields: {
    readonly startPosition: Point;
    readonly endPosition: Point;
  };
};

type TE_BLOOD = {
  readonly id: TempEntityType.TE_BLOOD;
  readonly name: "TE_BLOOD";
  readonly fields: {
    readonly position: Point;
    readonly vector: Point;
    readonly color: number;
    readonly count: number;
  };
};

type TE_DECAL = {
  readonly id: TempEntityType.TE_DECAL;
  readonly name: "TE_DECAL";
  readonly fields: {
    readonly position: Point;
    readonly decalIndex: number;
    readonly entityIndex: number;
  };
};

type TE_FIZZ = {
  readonly id: TempEntityType.TE_FIZZ;
  readonly name: "TE_FIZZ";
  readonly fields: {
    readonly entityIndex: number;
    readonly modelIndex: number;
    readonly scale: number;
  };
};

type TE_MODEL = {
  readonly id: TempEntityType.TE_MODEL;
  readonly name: "TE_MODEL";
  readonly fields: {
    readonly position: Point;
    readonly velocity: Point;
    readonly angle: {
      readonly pitch: number;
      readonly yaw: number;
      readonly roll: number;
    };
    readonly modelIndex: number;
    readonly flags: number;
    readonly life: number;
  };
};

type TE_EXPLODEMODEL = {
  readonly id: TempEntityType.TE_EXPLODEMODEL;
  readonly name: "TE_EXPLODEMODEL";
  readonly fields: {
    readonly position: Point;
    readonly velocity: number;
    readonly modelIndex: number;
    readonly count: number;
    readonly life: number;
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

type TE_SPRITE_SPRAY = {
  readonly id: TempEntityType.TE_SPRITE_SPRAY;
  readonly name: "TE_SPRITE_SPRAY";
  readonly fields: {
    readonly position: Point;
    readonly velocity: Point;
    readonly modelIndex: number;
    readonly count: number;
    readonly speed: number;
  };
};

type TE_ARMOR_RICOCHET = {
  readonly id: TempEntityType.TE_ARMOR_RICOCHET;
  readonly name: "TE_ARMOR_RICOCHET";
  readonly fields: {
    readonly position: Point;
    readonly scale: number;
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

type TE_BUBBLES = {
  readonly id: TempEntityType.TE_BUBBLES;
  readonly name: "TE_BUBBLES";
  readonly fields: {
    readonly minStartPosition: Point;
    readonly maxStartPosition: Point;
    readonly scale: number;
    readonly modelIndex: number;
    readonly count: number;
    readonly speed: number;
  };
};

type TE_BUBBLETRAIL = {
  readonly id: TempEntityType.TE_BUBBLETRAIL;
  readonly name: "TE_BUBBLETRAIL";
  readonly fields: {
    readonly minStartPosition: Point;
    readonly maxStartPosition: Point;
    readonly scale: number;
    readonly modelIndex: number;
    readonly count: number;
    readonly speed: number;
  };
};

type TE_BLOODSPRITE = {
  readonly id: TempEntityType.TE_BLOODSPRITE;
  readonly name: "TE_BLOODSPRITE";
  readonly fields: {
    readonly position: Point;
    readonly modelIndex: number;
    readonly decalIndex: number;
    readonly color: number;
    readonly scale: number;
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

type TE_WORLDDECALHIGH = {
  readonly id: TempEntityType.TE_WORLDDECALHIGH;
  readonly name: "TE_WORLDDECALHIGH";
  readonly fields: {
    readonly position: Point;
    readonly decalIndex: number;
  };
};

type TE_DECALHIGH = {
  readonly id: TempEntityType.TE_DECALHIGH;
  readonly name: "TE_DECALHIGH";
  readonly fields: {
    readonly position: Point;
    readonly decalIndex: number;
    readonly entityIndex: number;
  };
};

type TE_PROJECTILE = {
  readonly id: TempEntityType.TE_PROJECTILE;
  readonly name: "TE_PROJECTILE";
  readonly fields: {
    readonly position: Point;
    readonly velocity: Point;
    readonly modelIndex: number;
    readonly life: number;
    readonly color: number;
  };
};

type TE_SPRAY = {
  readonly id: TempEntityType.TE_SPRAY;
  readonly name: "TE_SPRAY";
  readonly fields: {
    readonly position: Point;
    readonly direction: Point;
    readonly modelIndex: number;
    readonly count: number;
    readonly speed: number;
    readonly noise: number;
    readonly renderMode: number;
  };
};

type TE_PLAYERSPRITES = {
  readonly id: TempEntityType.TE_PLAYERSPRITES;
  readonly name: "TE_PLAYERSPRITES";
  readonly fields: {
    readonly entityIndex: number;
    readonly modelIndex: number;
    readonly count: number;
    readonly variance: number;
  };
};

type TE_PARTICLEBURST = {
  readonly id: TempEntityType.TE_PARTICLEBURST;
  readonly name: "TE_PARTICLEBURST";
  readonly fields: {
    readonly origin: Point;
    readonly scale: number;
    readonly color: number;
    readonly duration: number;
  };
};

type TE_FIREFIELD = {
  readonly id: TempEntityType.TE_FIREFIELD;
  readonly name: "TE_FIREFIELD";
  readonly fields: {
    readonly origin: Point;
    readonly scale: number;
    readonly modelIndex: number;
    readonly count: number;
    readonly flags: number;
    readonly duration: number;
  };
};

type TE_PLAYERATTACHMENT = {
  readonly id: TempEntityType.TE_PLAYERATTACHMENT;
  readonly name: "TE_PLAYERATTACHMENT";
  readonly fields: {
    readonly entityIndex: number;
    readonly scale: number;
    readonly modelIndex: number;
    readonly life: number;
  };
};

type TE_KILLPLAYERATTACHMENTS = {
  readonly id: TempEntityType.TE_KILLPLAYERATTACHMENTS;
  readonly name: "TE_KILLPLAYERATTACHMENTS";
  readonly fields: {
    readonly entityIndex: number;
  };
};

type TE_MULTIGUNSHOT = {
  readonly id: TempEntityType.TE_MULTIGUNSHOT;
  readonly name: "TE_MULTIGUNSHOT";
  readonly fields: {
    readonly origin: Point;
    readonly direction: Point;
    readonly noise: Point;
  };
};

type TE_USERTRACER = {
  readonly id: TempEntityType.TE_USERTRACER;
  readonly name: "TE_USERTRACER";
  readonly fields: {
    readonly origin: Point;
    readonly velocity: Point;
    readonly life: number;
    readonly color: number;
    readonly scale: number;
  };
};

export type TempEntity = {
  readonly id: MessageType.SVC_TEMPENTITY;
  readonly name: "SVC_TEMPENTITY";
  readonly fields:
    | TE_BEAMPOINTS
    | TE_BEAMENTPOINT
    | TE_GUNSHOT
    | TE_EXPLOSION
    | TE_TAREXPLOSION
    | TE_SMOKE
    | TE_TRACER
    | TE_LIGHTNING
    | TE_BEAMENTS
    | TE_SPARKS
    | TE_LAVASPLASH
    | TE_TELEPORT
    | TE_EXPLOSION2
    | TE_BSPDECAL
    | TE_IMPLOSION
    | TE_SPRITETRAIL
    | TE_SPRITE
    | TE_BEAMSPRITE
    | TE_BEAMTORUS
    | TE_BEAMDISK
    | TE_BEAMCYLINDER
    | TE_BEAMFOLLOW
    | TE_GLOWSPRITE
    | TE_BEAMRING
    | TE_STREAK_SPLASH
    | TE_DLIGHT
    | TE_ELIGHT
    | TE_TEXTMESSAGE
    | TE_LINE
    | TE_BOX
    | TE_KILLBEAM
    | TE_LARGEFUNNEL
    | TE_BLOODSTREAM
    | TE_SHOWLINE
    | TE_BLOOD
    | TE_DECAL
    | TE_FIZZ
    | TE_MODEL
    | TE_EXPLODEMODEL
    | TE_BREAKMODEL
    | TE_GUNSHOTDECAL
    | TE_SPRITE_SPRAY
    | TE_ARMOR_RICOCHET
    | TE_PLAYERDECAL
    | TE_BUBBLES
    | TE_BUBBLETRAIL
    | TE_BLOODSPRITE
    | TE_WORLDDECAL
    | TE_WORLDDECALHIGH
    | TE_DECALHIGH
    | TE_PROJECTILE
    | TE_SPRAY
    | TE_PLAYERSPRITES
    | TE_PARTICLEBURST
    | TE_FIREFIELD
    | TE_PLAYERATTACHMENT
    | TE_KILLPLAYERATTACHMENTS
    | TE_MULTIGUNSHOT
    | TE_USERTRACER;
};

const coord: B.BufferParser<number> = pipe(
  B.int16_le,
  P.map((a) => a * 8)
);

// https://github.com/FWGS/xash3d-fwgs/blob/588dede2a2970477d59e333e97fb9ace4ca0b9e8/engine/common/net_buffer.c#L597-L603
const coordPoint: B.BufferParser<Point> = pointBy(coord);

export const tempEntity: B.BufferParser<TempEntity> = pipe(
  B.uint8_le,
  P.filter((id): id is TempEntityType => id in TempEntityType),
  P.chain((id): B.BufferParser<TempEntity["fields"]> => {
    switch (id) {
      case TempEntityType.TE_BEAMPOINTS: // 0
        return pipe(
          P.struct({
            startPosition: coordPoint,
            endPosition: coordPoint,
            spriteIndex: B.int16_le,
            startFrame: B.uint8_le,
            frameRate: B.uint8_le,
            life: B.uint8_le,
            width: B.uint8_le,
            noise: B.uint8_le,
            color: P.struct({
              r: B.uint8_le,
              g: B.uint8_le,
              b: B.uint8_le,
              a: B.uint8_le,
            }),
            speed: B.uint8_le,
          }),

          P.map((fields) => ({ id, name: "TE_BEAMPOINTS", fields }))
        );

      case TempEntityType.TE_BEAMENTPOINT: // 1
        return pipe(
          P.struct({
            startEntity: B.int16_le,
            endPosition: coordPoint,
            spriteIndex: B.int16_le,
            startFrame: B.uint8_le,
            frameRate: B.uint8_le,
            life: B.uint8_le,
            width: B.uint8_le,
            noise: B.uint8_le,
            color: P.struct({
              r: B.uint8_le,
              g: B.uint8_le,
              b: B.uint8_le,
              a: B.uint8_le,
            }),
            speed: B.uint8_le,
          }),

          P.map((fields) => ({ id, name: "TE_BEAMENTPOINT", fields }))
        );

      case TempEntityType.TE_GUNSHOT: // 2
        return pipe(
          P.struct({ position: coordPoint }),

          P.map((fields) => ({ id, name: "TE_GUNSHOT", fields }))
        );

      case TempEntityType.TE_EXPLOSION: // 3
        return pipe(
          P.struct({
            position: coordPoint,
            spriteIndex: B.int16_le,
            scale: B.uint8_le,
            frameRate: B.uint8_le,
            flags: B.uint8_le,
          }),

          P.map((fields) => ({ id, name: "TE_EXPLOSION", fields }))
        );

      case TempEntityType.TE_TAREXPLOSION: // 4
        return pipe(
          P.struct({ position: coordPoint }),

          P.map((fields) => ({ id, name: "TE_TAREXPLOSION", fields }))
        );

      case TempEntityType.TE_SMOKE: // 5
        return pipe(
          P.struct({
            position: coordPoint,
            spriteIndex: B.int16_le,
            scale: B.uint8_le,
            frameRate: B.uint8_le,
          }),

          P.map((fields) => ({ id, name: "TE_SMOKE", fields }))
        );

      case TempEntityType.TE_TRACER: // 6
        return pipe(
          P.struct({
            startPosition: coordPoint,
            endPosition: coordPoint,
          }),

          P.map((fields) => ({ id, name: "TE_TRACER", fields }))
        );

      case TempEntityType.TE_LIGHTNING: // 7
        return pipe(
          P.struct({
            startPosition: coordPoint,
            endPosition: coordPoint,
            life: B.uint8_le,
            width: B.uint8_le,
            noise: B.uint8_le,
            modelIndex: B.int16_le,
          }),

          P.map((fields) => ({ id, name: "TE_LIGHTNING", fields }))
        );

      case TempEntityType.TE_BEAMENTS: // 8
        return pipe(
          P.struct({
            startEntity: B.int16_le,
            endEntity: B.int16_le,
            spriteIndex: B.int16_le,
            startFrame: B.uint8_le,
            frameRate: B.uint8_le,
            life: B.uint8_le,
            width: B.uint8_le,
            noise: B.uint8_le,
            color: P.struct({
              r: B.uint8_le,
              g: B.uint8_le,
              b: B.uint8_le,
              a: B.uint8_le,
            }),
            speed: B.uint8_le,
          }),

          P.map((fields) => ({ id, name: "TE_BEAMENTS", fields }))
        );

      case TempEntityType.TE_SPARKS: // 9
        return pipe(
          P.struct({ position: coordPoint }),

          P.map((fields) => ({ id, name: "TE_SPARKS", fields }))
        );

      case TempEntityType.TE_LAVASPLASH: // 10
        return pipe(
          P.struct({ position: coordPoint }),

          P.map((fields) => ({ id, name: "TE_LAVASPLASH", fields }))
        );

      case TempEntityType.TE_TELEPORT: // 11
        return pipe(
          P.struct({ position: coordPoint }),

          P.map((fields) => ({ id, name: "TE_TELEPORT", fields }))
        );

      case TempEntityType.TE_EXPLOSION2: // 12
        return pipe(
          P.struct({
            position: coordPoint,
            color: B.uint8_le,
            count: B.uint8_le,
          }),

          P.map((fields) => ({ id, name: "TE_EXPLOSION2", fields }))
        );

      case TempEntityType.TE_BSPDECAL: // 13
        return pipe(
          P.struct({
            position: coordPoint,
            decalIndex: B.int16_le,
            entityIndex: B.int16_le,
          }),

          P.bind("modelIndex", ({ entityIndex }) =>
            entityIndex !== 0 ? B.int16_le : P.of(undefined)
          ),

          P.map((fields) => ({ id, name: "TE_BSPDECAL", fields }))
        );

      case TempEntityType.TE_IMPLOSION: // 14
        return pipe(
          P.struct({
            position: coordPoint,
            radius: B.uint8_le,
            count: B.uint8_le,
            life: B.uint8_le,
          }),

          P.map((fields) => ({ id, name: "TE_IMPLOSION", fields }))
        );

      case TempEntityType.TE_SPRITETRAIL: // 15
        return pipe(
          P.struct({
            startPosition: coordPoint,
            endPosition: coordPoint,
            spriteIndex: B.int16_le,
            count: B.uint8_le,
            life: B.uint8_le,
            scale: B.uint8_le,
            velocity: B.uint8_le,
            velocityRandomness: B.uint8_le,
          }),

          P.map((fields) => ({ id, name: "TE_SPRITETRAIL", fields }))
        );

      case TempEntityType.TE_SPRITE: // 17
        return pipe(
          P.struct({
            position: coordPoint,
            spriteIndex: B.int16_le,
            scale: B.uint8_le,
            brightness: B.uint8_le,
          }),

          P.map((fields) => ({ id, name: "TE_SPRITE", fields }))
        );

      case TempEntityType.TE_BEAMSPRITE: // 18
        return pipe(
          P.struct({
            startPosition: coordPoint,
            endPosition: coordPoint,
            beamSpriteIndex: B.int16_le,
            endSpriteIndex: B.int16_le,
          }),

          P.map((fields) => ({ id, name: "TE_BEAMSPRITE", fields }))
        );

      case TempEntityType.TE_BEAMTORUS: // 19
        return pipe(
          P.struct({
            position: coordPoint,
            axis: coordPoint,
            spriteIndex: B.int16_le,
            startFrame: B.uint8_le,
            frameRate: B.uint8_le,
            life: B.uint8_le,
            width: B.uint8_le,
            noise: B.uint8_le,
            color: P.struct({
              r: B.uint8_le,
              g: B.uint8_le,
              b: B.uint8_le,
              a: B.uint8_le,
            }),
            speed: B.uint8_le,
          }),

          P.map((fields) => ({ id, name: "TE_BEAMTORUS", fields }))
        );

      case TempEntityType.TE_BEAMDISK: // 20
        return pipe(
          P.struct({
            position: coordPoint,
            axis: coordPoint,
            spriteIndex: B.int16_le,
            startFrame: B.uint8_le,
            frameRate: B.uint8_le,
            life: B.uint8_le,
            width: B.uint8_le,
            noise: B.uint8_le,
            color: P.struct({
              r: B.uint8_le,
              g: B.uint8_le,
              b: B.uint8_le,
              a: B.uint8_le,
            }),
            speed: B.uint8_le,
          }),

          P.map((fields) => ({ id, name: "TE_BEAMDISK", fields }))
        );

      case TempEntityType.TE_BEAMCYLINDER: // 21
        return pipe(
          P.struct({
            position: coordPoint,
            axis: coordPoint,
            spriteIndex: B.int16_le,
            startFrame: B.uint8_le,
            frameRate: B.uint8_le,
            life: B.uint8_le,
            width: B.uint8_le,
            noise: B.uint8_le,
            color: P.struct({
              r: B.uint8_le,
              g: B.uint8_le,
              b: B.uint8_le,
              a: B.uint8_le,
            }),
            speed: B.uint8_le,
          }),

          P.map((fields) => ({ id, name: "TE_BEAMCYLINDER", fields }))
        );

      case TempEntityType.TE_BEAMFOLLOW: // 22
        return pipe(
          P.struct({
            startEntity: B.int16_le,
            spriteIndex: B.int16_le,
            life: B.uint8_le,
            width: B.uint8_le,
            color: P.struct({
              r: B.uint8_le,
              g: B.uint8_le,
              b: B.uint8_le,
              a: B.uint8_le,
            }),
          }),

          P.map((fields) => ({ id, name: "TE_BEAMFOLLOW", fields }))
        );

      case TempEntityType.TE_GLOWSPRITE: // 23
        return pipe(
          P.struct({
            position: coordPoint,
            modelIndex: B.int16_le,
            scale: B.uint8_le,
            size: B.uint8_le,
            brightness: B.uint8_le,
          }),

          P.map((fields) => ({ id, name: "TE_GLOWSPRITE", fields }))
        );

      case TempEntityType.TE_BEAMRING: // 24
        return pipe(
          P.struct({
            startEntity: B.int16_le,
            endEntity: B.int16_le,
            spriteIndex: B.int16_le,
            startFrame: B.uint8_le,
            frameRate: B.uint8_le,
            life: B.uint8_le,
            width: B.uint8_le,
            noise: B.uint8_le,
            color: P.struct({
              r: B.uint8_le,
              g: B.uint8_le,
              b: B.uint8_le,
              a: B.uint8_le,
            }),
            speed: B.uint8_le,
          }),

          P.map((fields) => ({ id, name: "TE_BEAMRING", fields }))
        );

      case TempEntityType.TE_STREAK_SPLASH: // 25
        return pipe(
          P.struct({
            startPosition: coordPoint,
            vector: coordPoint,
            color: B.uint8_le,
            count: B.int16_le,
            velocity: B.int16_le,
            velocityRandomness: B.int16_le,
          }),

          P.map((fields) => ({ id, name: "TE_STREAK_SPLASH", fields }))
        );

      case TempEntityType.TE_DLIGHT: // 27
        return pipe(
          P.struct({
            position: coordPoint,
            radius: B.uint8_le,
            color: P.struct({
              r: B.uint8_le,
              g: B.uint8_le,
              b: B.uint8_le,
            }),
            life: B.uint8_le,
            decayRate: B.uint8_le,
          }),

          P.map((fields) => ({ id, name: "TE_DLIGHT", fields }))
        );

      case TempEntityType.TE_ELIGHT: // 28
        return pipe(
          P.struct({
            entityIndex: B.int16_le,
            position: coordPoint,
            radius: B.uint8_le,
            color: P.struct({
              r: B.uint8_le,
              g: B.uint8_le,
              b: B.uint8_le,
            }),
            life: B.uint8_le,
          }),

          P.bind("decayRate", () =>
            pipe(
              B.int16_le
              // P.map((a) => (life !== 0 ? a / life : a))
            )
          ),

          P.map((fields) => ({ id, name: "TE_ELIGHT", fields }))
        );

      case TempEntityType.TE_TEXTMESSAGE: // 29
        return pipe(
          P.struct({
            channel: B.uint8_le,
            position: P.struct({
              x: pipe(
                B.int16_le
                // P.map((a) => a / 8192)
              ),
              y: pipe(
                B.int16_le
                // P.map((a) => a / 8192)
              ),
            }),
            effect: pipe(
              B.uint8_le,
              P.filter(
                (a): a is TE_TEXTMESSAGE_FX => a === 0 || a === 1 || a === 2
              )
            ),
            textColor: P.struct({
              r: B.uint8_le,
              g: B.uint8_le,
              b: B.uint8_le,
              a: B.uint8_le,
            }),
            effectColor: P.struct({
              r: B.uint8_le,
              g: B.uint8_le,
              b: B.uint8_le,
              a: B.uint8_le,
            }),
            fadeIn: pipe(
              B.int16_le
              // P.map((a) => a / 256)
            ),
            fadeOut: pipe(
              B.int16_le
              // P.map((a) => a / 256)
            ),
            hold: B.int16_le,
          }),

          P.bind("fxTime", ({ effect }) =>
            effect === TE_TEXTMESSAGE_FX.WriteOut
              ? pipe(
                  B.int16_le
                  // P.map((a) => a / 256)
                )
              : P.of(undefined)
          ),

          P.bind("textMessage", () => B.ztstr),

          P.map((fields) => ({ id, name: "TE_TEXTMESSAGE", fields }))
        );

      case TempEntityType.TE_LINE: // 30
        return pipe(
          P.struct({
            startPosition: coordPoint,
            endPosition: coordPoint,
            life: B.int16_le,
            color: P.struct({
              r: B.uint8_le,
              g: B.uint8_le,
              b: B.uint8_le,
            }),
          }),

          P.map((fields) => ({ id, name: "TE_LINE", fields }))
        );

      case TempEntityType.TE_BOX: // 31
        return pipe(
          P.struct({
            startPosition: coordPoint,
            endPosition: coordPoint,
            life: B.int16_le,
            color: P.struct({
              r: B.uint8_le,
              g: B.uint8_le,
              b: B.uint8_le,
            }),
          }),

          P.map((fields) => ({ id, name: "TE_BOX", fields }))
        );

      case TempEntityType.TE_KILLBEAM: // 99
        return pipe(
          P.struct({ entityIndex: B.int16_le }),

          P.map((fields) => ({ id, name: "TE_KILLBEAM", fields }))
        );

      case TempEntityType.TE_LARGEFUNNEL: // 100
        return pipe(
          P.struct({
            position: coordPoint,
            modelIndex: B.int16_le,
            flags: B.int16_le,
          }),

          P.map((fields) => ({ id, name: "TE_LARGEFUNNEL", fields }))
        );

      case TempEntityType.TE_BLOODSTREAM: // 101
        return pipe(
          P.struct({
            position: coordPoint,
            vector: coordPoint,
            color: B.uint8_le,
            count: B.uint8_le,
          }),

          P.map((fields) => ({ id, name: "TE_BLOODSTREAM", fields }))
        );

      case TempEntityType.TE_SHOWLINE: // 102
        return pipe(
          P.struct({
            startPosition: coordPoint,
            endPosition: coordPoint,
          }),

          P.map((fields) => ({ id, name: "TE_SHOWLINE", fields }))
        );

      case TempEntityType.TE_BLOOD: // 103
        return pipe(
          P.struct({
            position: coordPoint,
            vector: coordPoint,
            color: B.uint8_le,
            count: B.uint8_le,
          }),

          P.map((fields) => ({ id, name: "TE_BLOOD", fields }))
        );

      case TempEntityType.TE_DECAL: // 104
        return pipe(
          P.struct({
            position: coordPoint,
            decalIndex: B.uint8_le,
            entityIndex: B.int16_le,
          }),

          P.map((fields) => ({ id, name: "TE_DECAL", fields }))
        );

      case TempEntityType.TE_FIZZ: // 105
        return pipe(
          P.struct({
            entityIndex: B.int16_le,
            modelIndex: B.int16_le,
            scale: B.uint8_le,
          }),

          P.map((fields) => ({ id, name: "TE_FIZZ", fields }))
        );

      case TempEntityType.TE_MODEL: // 106
        return pipe(
          P.struct({
            position: coordPoint,
            velocity: coordPoint,
            angle: pipe(
              B.float32_le, // TODO ???
              P.map((yaw) => ({ pitch: 0, yaw, roll: 0 }))
            ),
            modelIndex: B.int16_le,
            flags: B.uint8_le,
            life: pipe(
              B.uint8_le
              // P.map((a) => a * 10)
            ),
          }),

          P.map((fields) => ({ id, name: "TE_MODEL", fields }))
        );

      case TempEntityType.TE_EXPLODEMODEL: // 107
        return pipe(
          P.struct({
            position: coordPoint,
            velocity: coord,
            modelIndex: B.int16_le,
            count: B.int16_le,
            life: B.uint8_le,
          }),

          P.map((fields) => ({ id, name: "TE_EXPLODEMODEL", fields }))
        );

      case TempEntityType.TE_BREAKMODEL: // 108
        return pipe(
          P.struct({
            position: coordPoint,
            size: coordPoint,
            velocity: coordPoint,
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
            position: coordPoint,
            entityIndex: B.int16_le,
            decal: B.uint8_le,
          }),

          P.map((fields) => ({ id, name: "TE_GUNSHOTDECAL", fields }))
        );

      case TempEntityType.TE_SPRITE_SPRAY: // 110
        return pipe(
          P.struct({
            position: coordPoint,
            velocity: coordPoint,
            modelIndex: B.int16_le,
            count: B.uint8_le,
            speed: B.uint8_le,
            random: B.uint8_le,
          }),

          P.map((fields) => ({ id, name: "TE_SPRITE_SPRAY", fields }))
        );

      case TempEntityType.TE_ARMOR_RICOCHET: // 111
        return pipe(
          P.struct({
            position: coordPoint,
            scale: B.uint8_le,
          }),

          P.map((fields) => ({ id, name: "TE_ARMOR_RICOCHET", fields }))
        );

      case TempEntityType.TE_PLAYERDECAL: // 112
        return pipe(
          P.struct({
            playerIndex: B.uint8_le,
            position: coordPoint,
            entityIndex: B.int16_le,
            decalIndex: B.uint8_le,
            // [optional] short (model index???)
            // modelIndex: B.int16_le,
          }),

          P.map((fields) => ({ id, name: "TE_PLAYERDECAL", fields }))
        );

      case TempEntityType.TE_BUBBLES: // 113
        return pipe(
          P.struct({
            minStartPosition: coordPoint,
            maxStartPosition: coordPoint,
            scale: coord,
            modelIndex: B.int16_le,
            count: B.uint8_le,
            speed: B.uint8_le,
          }),

          P.map((fields) => ({ id, name: "TE_BUBBLES", fields }))
        );

      case TempEntityType.TE_BUBBLETRAIL: // 114
        return pipe(
          P.struct({
            minStartPosition: coordPoint,
            maxStartPosition: coordPoint,
            scale: coord,
            modelIndex: B.int16_le,
            count: B.uint8_le,
            speed: B.uint8_le,
          }),

          P.map((fields) => ({ id, name: "TE_BUBBLETRAIL", fields }))
        );

      case TempEntityType.TE_BLOODSPRITE: // 115
        return pipe(
          P.struct({
            position: coordPoint,
            modelIndex: B.int16_le,
            decalIndex: B.int16_le,
            color: B.uint8_le,
            scale: B.uint8_le,
          }),

          P.map((fields) => ({ id, name: "TE_BLOODSPRITE", fields }))
        );

      case TempEntityType.TE_WORLDDECAL: // 116
        return pipe(
          P.struct({
            position: coordPoint,
            textureIndex: B.uint8_le,
          }),

          P.map((fields) => ({ id, name: "TE_WORLDDECAL", fields }))
        );

      case TempEntityType.TE_WORLDDECALHIGH: // 117
        return pipe(
          P.struct({
            position: coordPoint,
            decalIndex: B.uint8_le,
          }),

          P.map((fields) => ({ id, name: "TE_WORLDDECALHIGH", fields }))
        );

      case TempEntityType.TE_DECALHIGH: // 118
        return pipe(
          P.struct({
            position: coordPoint,
            decalIndex: B.uint8_le,
            entityIndex: B.int16_le,
          }),

          P.map((fields) => ({ id, name: "TE_DECALHIGH", fields }))
        );

      case TempEntityType.TE_PROJECTILE: // 119
        return pipe(
          P.struct({
            position: coordPoint,
            velocity: coordPoint,
            modelIndex: B.int16_le,
            life: B.uint8_le,
            color: B.uint8_le,
          }),

          P.map((fields) => ({ id, name: "TE_PROJECTILE", fields }))
        );

      case TempEntityType.TE_SPRAY: // 120
        return pipe(
          P.struct({
            position: coordPoint,
            direction: coordPoint,
            modelIndex: B.int16_le,
            count: B.uint8_le,
            speed: B.uint8_le,
            noise: B.uint8_le,
            renderMode: B.uint8_le,
          }),

          P.map((fields) => ({ id, name: "TE_SPRAY", fields }))
        );

      case TempEntityType.TE_PLAYERSPRITES: // 121
        return pipe(
          P.struct({
            entityIndex: B.int16_le,
            modelIndex: B.int16_le,
            count: B.uint8_le,
            variance: B.uint8_le,
          }),

          P.map((fields) => ({ id, name: "TE_PLAYERSPRITES", fields }))
        );

      case TempEntityType.TE_PARTICLEBURST: // 122
        return pipe(
          P.struct({
            origin: coordPoint,
            scale: B.int16_le,
            color: B.uint8_le,
            duration: B.uint8_le,
          }),

          P.map((fields) => ({ id, name: "TE_PARTICLEBURST", fields }))
        );

      case TempEntityType.TE_FIREFIELD: // 123
        return pipe(
          P.struct({
            origin: coordPoint,
            scale: B.int16_le,
            modelIndex: B.int16_le,
            count: B.uint8_le,
            flags: B.uint8_le,
            duration: B.uint8_le,
          }),

          P.map((fields) => ({ id, name: "TE_FIREFIELD", fields }))
        );

      case TempEntityType.TE_PLAYERATTACHMENT: // 124
        return pipe(
          P.struct({
            entityIndex: B.uint8_le,
            scale: coord,
            modelIndex: B.int16_le,
            life: B.int16_le,
          }),

          P.map((fields) => ({ id, name: "TE_PLAYERATTACHMENT", fields }))
        );

      case TempEntityType.TE_KILLPLAYERATTACHMENTS: // 125
        return pipe(
          P.struct({ entityIndex: B.uint8_le }),

          P.map((fields) => ({ id, name: "TE_KILLPLAYERATTACHMENTS", fields }))
        );

      case TempEntityType.TE_MULTIGUNSHOT: // 126
        return pipe(
          P.struct({
            origin: coordPoint,
            direction: coordPoint,
            noise: pipe(
              P.tuple(coord, coord),
              P.map(([x, y]) => ({ x, y, z: 0 }))
            ),
          }),

          P.map((fields) => ({ id, name: "TE_MULTIGUNSHOT", fields }))
        );

      case TempEntityType.TE_USERTRACER: // 127
        return pipe(
          P.struct({
            origin: coordPoint,
            velocity: coordPoint,
            life: B.uint8_le,
            color: B.uint8_le,
            scale: B.uint8_le,
          }),

          P.map((fields) => ({ id, name: "TE_USERTRACER", fields }))
        );

      default:
        absurd(id);

        return P.cut(P.fail());
    }
  }),

  P.map((fields) => ({
    id: MessageType.SVC_TEMPENTITY as const,
    name: "SVC_TEMPENTITY" as const,
    fields,
  }))
);
