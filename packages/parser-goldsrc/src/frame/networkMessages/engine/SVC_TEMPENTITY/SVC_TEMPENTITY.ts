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
                (a): a is TE.TE_TEXTMESSAGE_FX => a === 0 || a === 1 || a === 2
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
            effect === TE.TE_TEXTMESSAGE_FX.WriteOut
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
