import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { absurd, pipe } from "fp-ts/lib/function";
import type { Point } from "../../../../Point";
import { pointBy } from "../../../../Point";
import { MessageType } from "../../MessageType";
import { TempEntityType } from "./TempEntityType";
import type { TE_ARMOR_RICOCHET } from "./TE_ARMOR_RICOCHET";
import type { TE_BEAMCYLINDER } from "./TE_BEAMCYLINDER";
import type { TE_BEAMDISK } from "./TE_BEAMDISK";
import type { TE_BEAMENTPOINT } from "./TE_BEAMENTPOINT";
import type { TE_BEAMENTS } from "./TE_BEAMENTS";
import type { TE_BEAMFOLLOW } from "./TE_BEAMFOLLOW";
import type { TE_BEAMPOINTS } from "./TE_BEAMPOINTS";
import type { TE_BEAMRING } from "./TE_BEAMRING";
import type { TE_BEAMSPRITE } from "./TE_BEAMSPRITE";
import type { TE_BEAMTORUS } from "./TE_BEAMTORUS";
import type { TE_BLOOD } from "./TE_BLOOD";
import type { TE_BLOODSPRITE } from "./TE_BLOODSPRITE";
import type { TE_BLOODSTREAM } from "./TE_BLOODSTREAM";
import type { TE_BOX } from "./TE_BOX";
import type { TE_BREAKMODEL } from "./TE_BREAKMODEL";
import type { TE_BSPDECAL } from "./TE_BSPDECAL";
import type { TE_BUBBLES } from "./TE_BUBBLES";
import type { TE_BUBBLETRAIL } from "./TE_BUBBLETRAIL";
import type { TE_DECAL } from "./TE_DECAL";
import type { TE_DECALHIGH } from "./TE_DECALHIGH";
import type { TE_DLIGHT } from "./TE_DLIGHT";
import type { TE_ELIGHT } from "./TE_ELIGHT";
import type { TE_EXPLODEMODEL } from "./TE_EXPLODEMODEL";
import type { TE_EXPLOSION } from "./TE_EXPLOSION";
import type { TE_EXPLOSION2 } from "./TE_EXPLOSION2";
import type { TE_FIREFIELD } from "./TE_FIREFIELD";
import type { TE_FIZZ } from "./TE_FIZZ";
import type { TE_GLOWSPRITE } from "./TE_GLOWSPRITE";
import type { TE_GUNSHOT } from "./TE_GUNSHOT";
import type { TE_GUNSHOTDECAL } from "./TE_GUNSHOTDECAL";
import type { TE_IMPLOSION } from "./TE_IMPLOSION";
import type { TE_KILLBEAM } from "./TE_KILLBEAM";
import type { TE_KILLPLAYERATTACHMENTS } from "./TE_KILLPLAYERATTACHMENTS";
import type { TE_LARGEFUNNEL } from "./TE_LARGEFUNNEL";
import type { TE_LAVASPLASH } from "./TE_LAVASPLASH";
import type { TE_LIGHTNING } from "./TE_LIGHTNING";
import type { TE_LINE } from "./TE_LINE";
import type { TE_MODEL } from "./TE_MODEL";
import type { TE_MULTIGUNSHOT } from "./TE_MULTIGUNSHOT";
import type { TE_PARTICLEBURST } from "./TE_PARTICLEBURST";
import type { TE_PLAYERATTACHMENT } from "./TE_PLAYERATTACHMENT";
import type { TE_PLAYERDECAL } from "./TE_PLAYERDECAL";
import type { TE_PLAYERSPRITES } from "./TE_PLAYERSPRITES";
import type { TE_PROJECTILE } from "./TE_PROJECTILE";
import type { TE_SHOWLINE } from "./TE_SHOWLINE";
import type { TE_SMOKE } from "./TE_SMOKE";
import type { TE_SPARKS } from "./TE_SPARKS";
import type { TE_SPRAY } from "./TE_SPRAY";
import type { TE_SPRITE } from "./TE_SPRITE";
import type { TE_SPRITETRAIL } from "./TE_SPRITETRAIL";
import type { TE_SPRITE_SPRAY } from "./TE_SPRITE_SPRAY";
import type { TE_STREAK_SPLASH } from "./TE_STREAK_SPLASH";
import type { TE_TAREXPLOSION } from "./TE_TAREXPLOSION";
import type { TE_TELEPORT } from "./TE_TELEPORT";
import type { TE_TEXTMESSAGE} from "./TE_TEXTMESSAGE";
import { TE_TEXTMESSAGE_FX } from "./TE_TEXTMESSAGE";
import type { TE_TRACER } from "./TE_TRACER";
import type { TE_USERTRACER } from "./TE_USERTRACER";
import type { TE_WORLDDECAL } from "./TE_WORLDDECAL";
import type { TE_WORLDDECALHIGH } from "./TE_WORLDDECALHIGH";

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
