import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { absurd, pipe } from "fp-ts/lib/function";
import type { Point } from "../../../../Point";
import { pointBy } from "../../../../Point";
import { MessageType } from "../../MessageType";
import * as TE from "./TempEntity";
import { TempEntityType } from "./TempEntityType";

export type TempEntity = {
  readonly id: MessageType.SVC_TEMPENTITY;
  readonly name: "SVC_TEMPENTITY";
  readonly fields:
    | TE.TE_BEAMPOINTS
    | TE.TE_BEAMENTPOINT
    | TE.TE_GUNSHOT
    | TE.TE_EXPLOSION
    | TE.TE_TAREXPLOSION
    | TE.TE_SMOKE
    | TE.TE_TRACER
    | TE.TE_LIGHTNING
    | TE.TE_BEAMENTS
    | TE.TE_SPARKS
    | TE.TE_LAVASPLASH
    | TE.TE_TELEPORT
    | TE.TE_EXPLOSION2
    | TE.TE_BSPDECAL
    | TE.TE_IMPLOSION
    | TE.TE_SPRITETRAIL
    | TE.TE_SPRITE
    | TE.TE_BEAMSPRITE
    | TE.TE_BEAMTORUS
    | TE.TE_BEAMDISK
    | TE.TE_BEAMCYLINDER
    | TE.TE_BEAMFOLLOW
    | TE.TE_GLOWSPRITE
    | TE.TE_BEAMRING
    | TE.TE_STREAK_SPLASH
    | TE.TE_DLIGHT
    | TE.TE_ELIGHT
    | TE.TE_TEXTMESSAGE
    | TE.TE_LINE
    | TE.TE_BOX
    | TE.TE_KILLBEAM
    | TE.TE_LARGEFUNNEL
    | TE.TE_BLOODSTREAM
    | TE.TE_SHOWLINE
    | TE.TE_BLOOD
    | TE.TE_DECAL
    | TE.TE_FIZZ
    | TE.TE_MODEL
    | TE.TE_EXPLODEMODEL
    | TE.TE_BREAKMODEL
    | TE.TE_GUNSHOTDECAL
    | TE.TE_SPRITE_SPRAY
    | TE.TE_ARMOR_RICOCHET
    | TE.TE_PLAYERDECAL
    | TE.TE_BUBBLES
    | TE.TE_BUBBLETRAIL
    | TE.TE_BLOODSPRITE
    | TE.TE_WORLDDECAL
    | TE.TE_WORLDDECALHIGH
    | TE.TE_DECALHIGH
    | TE.TE_PROJECTILE
    | TE.TE_SPRAY
    | TE.TE_PLAYERSPRITES
    | TE.TE_PARTICLEBURST
    | TE.TE_FIREFIELD
    | TE.TE_PLAYERATTACHMENT
    | TE.TE_KILLPLAYERATTACHMENTS
    | TE.TE_MULTIGUNSHOT
    | TE.TE_USERTRACER;
};

export const coord: B.BufferParser<number> = pipe(
  B.int16_le,
  P.map((a) => a * 8)
);

// https://github.com/FWGS/xash3d-fwgs/blob/588dede2a2970477d59e333e97fb9ace4ca0b9e8/engine/common/net_buffer.c#L597-L603
export const coordPoint: B.BufferParser<Point> = pointBy(coord);

export const tempEntity: B.BufferParser<TempEntity> = pipe(
  B.uint8_le,
  P.filter((id): id is TempEntityType => id in TempEntityType),
  P.chain((id): B.BufferParser<TempEntity["fields"]> => {
    switch (id) {
      case TempEntityType.TE_BEAMPOINTS: // 0
        return TE.beamPoints;

      case TempEntityType.TE_BEAMENTPOINT: // 1
        return TE.beamEntPoint;

      case TempEntityType.TE_GUNSHOT: // 2
        return TE.gunshot;

      case TempEntityType.TE_EXPLOSION: // 3
        return TE.explosion;

      case TempEntityType.TE_TAREXPLOSION: // 4
        return TE.tarExplosion;

      case TempEntityType.TE_SMOKE: // 5
        return TE.smoke;

      case TempEntityType.TE_TRACER: // 6
        return TE.tracer;

      case TempEntityType.TE_LIGHTNING: // 7
        return TE.lightning;

      case TempEntityType.TE_BEAMENTS: // 8
        return TE.beamEnts;

      case TempEntityType.TE_SPARKS: // 9
        return TE.sparks;

      case TempEntityType.TE_LAVASPLASH: // 10
        return TE.lavasplash;

      case TempEntityType.TE_TELEPORT: // 11
        return TE.teleport;

      case TempEntityType.TE_EXPLOSION2: // 12
        return TE.explosion2;

      case TempEntityType.TE_BSPDECAL: // 13
        return TE.bspDecal;

      case TempEntityType.TE_IMPLOSION: // 14
        return TE.implosion;

      case TempEntityType.TE_SPRITETRAIL: // 15
        return TE.spriteTrail;

      case TempEntityType.TE_SPRITE: // 17
        return TE.sprite;

      case TempEntityType.TE_BEAMSPRITE: // 18
        return TE.beamSprite;

      case TempEntityType.TE_BEAMTORUS: // 19
        return TE.beamToRus;

      case TempEntityType.TE_BEAMDISK: // 20
        return TE.beamDisk;

      case TempEntityType.TE_BEAMCYLINDER: // 21
        return TE.beamCylinder;

      case TempEntityType.TE_BEAMFOLLOW: // 22
        return TE.beamFollow;

      case TempEntityType.TE_GLOWSPRITE: // 23
        return TE.glowSprite;

      case TempEntityType.TE_BEAMRING: // 24
        return TE.beamRing;

      case TempEntityType.TE_STREAK_SPLASH: // 25
        return TE.streakSplash;

      case TempEntityType.TE_DLIGHT: // 27
        return TE.dLight;

      case TempEntityType.TE_ELIGHT: // 28
        return TE.eLight;

      case TempEntityType.TE_TEXTMESSAGE: // 29
        return TE.textMessage;

      case TempEntityType.TE_LINE: // 30
        return TE.line;

      case TempEntityType.TE_BOX: // 31
        return TE.box;

      case TempEntityType.TE_KILLBEAM: // 99
        return TE.killBeam;

      case TempEntityType.TE_LARGEFUNNEL: // 100
        return TE.largeFunnel;

      case TempEntityType.TE_BLOODSTREAM: // 101
        return TE.bloodStream;

      case TempEntityType.TE_SHOWLINE: // 102
        return TE.showLine;

      case TempEntityType.TE_BLOOD: // 103
        return TE.blood;

      case TempEntityType.TE_DECAL: // 104
        return TE.decal;

      case TempEntityType.TE_FIZZ: // 105
        return TE.fizz;

      case TempEntityType.TE_MODEL: // 106
        return TE.model;

      case TempEntityType.TE_EXPLODEMODEL: // 107
        return TE.explodeModel;

      case TempEntityType.TE_BREAKMODEL: // 108
        return TE.breakModel;

      case TempEntityType.TE_GUNSHOTDECAL: // 109
        return TE.gunshotDecal;

      case TempEntityType.TE_SPRITE_SPRAY: // 110
        return TE.spriteSpray;

      case TempEntityType.TE_ARMOR_RICOCHET: // 111
        return TE.armorRicochet;

      case TempEntityType.TE_PLAYERDECAL: // 112
        return TE.playerDecal;

      case TempEntityType.TE_BUBBLES: // 113
        return TE.bubbles;

      case TempEntityType.TE_BUBBLETRAIL: // 114
        return TE.bubbleTrail;

      case TempEntityType.TE_BLOODSPRITE: // 115
        return TE.bloodSprite;

      case TempEntityType.TE_WORLDDECAL: // 116
        return TE.worldDecal;

      case TempEntityType.TE_WORLDDECALHIGH: // 117
        return TE.worldDecalHigh;

      case TempEntityType.TE_DECALHIGH: // 118
        return TE.decalHigh;

      case TempEntityType.TE_PROJECTILE: // 119
        return TE.projectile;

      case TempEntityType.TE_SPRAY: // 120
        return TE.spray;

      case TempEntityType.TE_PLAYERSPRITES: // 121
        return TE.playerSprites;

      case TempEntityType.TE_PARTICLEBURST: // 122
        return TE.particleBurst;

      case TempEntityType.TE_FIREFIELD: // 123
        return TE.fireField;

      case TempEntityType.TE_PLAYERATTACHMENT: // 124
        return TE.playerAttachment;

      case TempEntityType.TE_KILLPLAYERATTACHMENTS: // 125
        return TE.killPlayerAttachments;

      case TempEntityType.TE_MULTIGUNSHOT: // 126
        return TE.multiGunshot;

      case TempEntityType.TE_USERTRACER: // 127
        return TE.userTracer;

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
