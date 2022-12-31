import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import * as P from '@cgdangelo/talent-parser/lib/Parser';
import { absurd, pipe } from 'fp-ts/lib/function';
import { MessageType } from '../../MessageType';
import * as TENT from './TempEntity';
import { TempEntityType } from './TempEntityType';

export type TempEntity = {
  readonly id: MessageType.SVC_TEMPENTITY;
  readonly name: 'SVC_TEMPENTITY';
  readonly fields:
    | TENT.BeamPoints
    | TENT.BeamEntPoint
    | TENT.Gunshot
    | TENT.Explosion
    | TENT.TarExplosion
    | TENT.Smoke
    | TENT.Tracer
    | TENT.Lightning
    | TENT.BeamEnts
    | TENT.Sparks
    | TENT.LavaSplash
    | TENT.Teleport
    | TENT.Explosion2
    | TENT.BSPDecal
    | TENT.Implosion
    | TENT.SpriteTrail
    | TENT.Sprite
    | TENT.BeamSprite
    | TENT.BeamToRus
    | TENT.BeamDisk
    | TENT.BeamCylinder
    | TENT.BeamFollow
    | TENT.GlowSprite
    | TENT.BeamRing
    | TENT.StreakSplash
    | TENT.DLight
    | TENT.ELight
    | TENT.TextMessage
    | TENT.Line
    | TENT.Box
    | TENT.KillBeam
    | TENT.LargeFunnel
    | TENT.Bloodstream
    | TENT.ShowLine
    | TENT.Blood
    | TENT.Decal
    | TENT.Fizz
    | TENT.Model
    | TENT.ExplodeModel
    | TENT.BreakModel
    | TENT.GunshotDecal
    | TENT.SpriteSpray
    | TENT.ArmorRicochet
    | TENT.PlayerDecal
    | TENT.Bubbles
    | TENT.BubbleTrail
    | TENT.BloodSprite
    | TENT.WorldDecal
    | TENT.WorldDecalHigh
    | TENT.DecalHigh
    | TENT.Projectile
    | TENT.Spray
    | TENT.PlayerSprites
    | TENT.ParticleBurst
    | TENT.FireField
    | TENT.PlayerAttachment
    | TENT.KillPlayerAttachments
    | TENT.MultiGunshot
    | TENT.UserTracer;
};

export const tempEntity: B.BufferParser<TempEntity> = pipe(
  B.uint8_le,
  P.filter((id): id is TempEntityType => id in TempEntityType),
  P.chain((id): B.BufferParser<TempEntity['fields']> => {
    switch (id) {
      case TempEntityType.TE_BEAMPOINTS: // 0
        return TENT.beamPoints;

      case TempEntityType.TE_BEAMENTPOINT: // 1
        return TENT.beamEntPoint;

      case TempEntityType.TE_GUNSHOT: // 2
        return TENT.gunshot;

      case TempEntityType.TE_EXPLOSION: // 3
        return TENT.explosion;

      case TempEntityType.TE_TAREXPLOSION: // 4
        return TENT.tarExplosion;

      case TempEntityType.TE_SMOKE: // 5
        return TENT.smoke;

      case TempEntityType.TE_TRACER: // 6
        return TENT.tracer;

      case TempEntityType.TE_LIGHTNING: // 7
        return TENT.lightning;

      case TempEntityType.TE_BEAMENTS: // 8
        return TENT.beamEnts;

      case TempEntityType.TE_SPARKS: // 9
        return TENT.sparks;

      case TempEntityType.TE_LAVASPLASH: // 10
        return TENT.lavaSplash;

      case TempEntityType.TE_TELEPORT: // 11
        return TENT.teleport;

      case TempEntityType.TE_EXPLOSION2: // 12
        return TENT.explosion2;

      case TempEntityType.TE_BSPDECAL: // 13
        return TENT.bspDecal;

      case TempEntityType.TE_IMPLOSION: // 14
        return TENT.implosion;

      case TempEntityType.TE_SPRITETRAIL: // 15
        return TENT.spriteTrail;

      case TempEntityType.TE_SPRITE: // 17
        return TENT.sprite;

      case TempEntityType.TE_BEAMSPRITE: // 18
        return TENT.beamSprite;

      case TempEntityType.TE_BEAMTORUS: // 19
        return TENT.beamToRus;

      case TempEntityType.TE_BEAMDISK: // 20
        return TENT.beamDisk;

      case TempEntityType.TE_BEAMCYLINDER: // 21
        return TENT.beamCylinder;

      case TempEntityType.TE_BEAMFOLLOW: // 22
        return TENT.beamFollow;

      case TempEntityType.TE_GLOWSPRITE: // 23
        return TENT.glowSprite;

      case TempEntityType.TE_BEAMRING: // 24
        return TENT.beamRing;

      case TempEntityType.TE_STREAK_SPLASH: // 25
        return TENT.streakSplash;

      case TempEntityType.TE_DLIGHT: // 27
        return TENT.dLight;

      case TempEntityType.TE_ELIGHT: // 28
        return TENT.eLight;

      case TempEntityType.TE_TEXTMESSAGE: // 29
        return TENT.textMessage;

      case TempEntityType.TE_LINE: // 30
        return TENT.line;

      case TempEntityType.TE_BOX: // 31
        return TENT.box;

      case TempEntityType.TE_KILLBEAM: // 99
        return TENT.killBeam;

      case TempEntityType.TE_LARGEFUNNEL: // 100
        return TENT.largeFunnel;

      case TempEntityType.TE_BLOODSTREAM: // 101
        return TENT.bloodstream;

      case TempEntityType.TE_SHOWLINE: // 102
        return TENT.showLine;

      case TempEntityType.TE_BLOOD: // 103
        return TENT.blood;

      case TempEntityType.TE_DECAL: // 104
        return TENT.decal;

      case TempEntityType.TE_FIZZ: // 105
        return TENT.fizz;

      case TempEntityType.TE_MODEL: // 106
        return TENT.model;

      case TempEntityType.TE_EXPLODEMODEL: // 107
        return TENT.explodeModel;

      case TempEntityType.TE_BREAKMODEL: // 108
        return TENT.breakModel;

      case TempEntityType.TE_GUNSHOTDECAL: // 109
        return TENT.gunshotDecal;

      case TempEntityType.TE_SPRITE_SPRAY: // 110
        return TENT.spriteSpray;

      case TempEntityType.TE_ARMOR_RICOCHET: // 111
        return TENT.armorRicochet;

      case TempEntityType.TE_PLAYERDECAL: // 112
        return TENT.playerDecal;

      case TempEntityType.TE_BUBBLES: // 113
        return TENT.bubbles;

      case TempEntityType.TE_BUBBLETRAIL: // 114
        return TENT.bubbleTrail;

      case TempEntityType.TE_BLOODSPRITE: // 115
        return TENT.bloodSprite;

      case TempEntityType.TE_WORLDDECAL: // 116
        return TENT.worldDecal;

      case TempEntityType.TE_WORLDDECALHIGH: // 117
        return TENT.worldDecalHigh;

      case TempEntityType.TE_DECALHIGH: // 118
        return TENT.decalHigh;

      case TempEntityType.TE_PROJECTILE: // 119
        return TENT.projectile;

      case TempEntityType.TE_SPRAY: // 120
        return TENT.spray;

      case TempEntityType.TE_PLAYERSPRITES: // 121
        return TENT.playerSprites;

      case TempEntityType.TE_PARTICLEBURST: // 122
        return TENT.particleBurst;

      case TempEntityType.TE_FIREFIELD: // 123
        return TENT.fireField;

      case TempEntityType.TE_PLAYERATTACHMENT: // 124
        return TENT.playerAttachment;

      case TempEntityType.TE_KILLPLAYERATTACHMENTS: // 125
        return TENT.killPlayerAttachments;

      case TempEntityType.TE_MULTIGUNSHOT: // 126
        return TENT.multiGunshot;

      case TempEntityType.TE_USERTRACER: // 127
        return TENT.userTracer;

      default:
        absurd(id);

        return P.cut(P.fail());
    }
  }),

  P.map((fields) => ({
    id: MessageType.SVC_TEMPENTITY as const,
    name: 'SVC_TEMPENTITY' as const,
    fields
  }))
);
