import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "../../../Point";
import { MessageType } from "../MessageType";

export type TempEntity = {
  readonly id: MessageType.SVC_TEMPENTITY;
  readonly name: "SVC_TEMPENTITY";

  // TODO fix type fields
  readonly fields:
    | {
        // #define TE_BEAMPOINTS  0  // beam effect between two points
        readonly type: { readonly id: 0; readonly name: "TE_BEAMPOINTS" };
        // coord coord coord (start position)
        readonly startPosition: Point;
        // coord coord coord (end position)
        readonly endPosition: Point;
        // short (sprite index)
        readonly spriteIndex: number;
        // byte (starting frame)
        readonly startingFrame: number;
        // byte (frame rate in 0.1's)
        readonly frameRate: number;
        // byte (life in 0.1's)
        readonly life: number;
        // byte (line width in 0.1's)
        readonly lineWidth: number;
        // byte (noise amplitude in 0.01's)
        readonly noiseAmplitude: number;
        // byte,byte,byte (color)
        readonly color: {
          readonly r: number;
          readonly g: number;
          readonly b: number;
        };
        // byte (brightness)
        readonly brightness: number;
        // byte (scroll speed in 0.1's)
        readonly scrollSpeed: number;
      }
    | {
        // #define TE_BEAMENTPOINT  1  // beam effect between point and entity
        readonly type: { readonly id: 1; readonly name: "TE_BEAMENTPOINT" };
        // short (start entity)
        readonly startEntity: number;
        // coord coord coord (end position)
        readonly endPosition: Point;
        // short (sprite index)
        readonly spriteIndex: number;
        // byte (starting frame)
        readonly startingFrame: number;
        // byte (frame rate in 0.1's)
        readonly frameRate: number;
        // byte (life in 0.1's)
        readonly life: number;
        // byte (line width in 0.1's)
        readonly lineWidth: number;
        // byte (noise amplitude in 0.01's)
        readonly noiseAmplitude: number;
        // byte,byte,byte (color)
        readonly color: {
          readonly r: number;
          readonly g: number;
          readonly b: number;
        };
        // byte (brightness)
        readonly brightness: number;
        // byte (scroll speed in 0.1's)
        readonly scrollSped: number;
      }
    | {
        // #define TE_GUNSHOT   2  // particle effect plus ricochet sound
        readonly type: { readonly id: 2; readonly name: "TE_GUNSHOT" };
        // coord coord coord (position)
        readonly position: Point;
      }
    | {
        // #define TE_EXPLOSION  3  // additive sprite, 2 dynamic lights, flickering particles, explosion sound, move vertically 8 pps
        readonly type: { readonly id: 3; readonly name: "TE_EXPLOSION" };
        // coord coord coord (position)
        readonly position: Point;
        // short (sprite index)
        readonly spriteIndex: number;
        // byte (scale in 0.1's)
        readonly scale: number;
        // byte (framerate)
        readonly frameRate: number;
        // byte (flags)
        // The Explosion effect has some flags to control performance/aesthetic features:
        readonly flags: {
          // #define TE_EXPLFLAG_NONE  0 // all flags clear makes default Half-Life explosion
          readonly defaultExplosion: boolean;
          // #define TE_EXPLFLAG_NOADDITIVE 1 // sprite will be drawn opaque (ensure that the sprite you send is a non-additive sprite)
          readonly opaqueSprite: boolean;
          // #define TE_EXPLFLAG_NODLIGHTS 2 // do not render dynamic lights
          readonly dynamicLights: boolean;
          // #define TE_EXPLFLAG_NOSOUND  4 // do not play client explosion sound
          readonly sound: boolean;
          // #define TE_EXPLFLAG_NOPARTICLES 8 // do not draw particles
          readonly particles: boolean;
        };
      }
    | {
        // #define TE_TAREXPLOSION  4  // Quake1 "tarbaby" explosion with sound
        readonly type: { readonly id: 4; readonly name: "TE_TAREXPLOSION" };
        // coord coord coord (position)
        readonly position: Point;
      }
    | {
        // #define TE_SMOKE   5  // alphablend sprite, move vertically 30 pps
        readonly type: { readonly id: 5; readonly name: "TE_SMOKE" };
        // coord coord coord (position)
        readonly position: Point;
        // short (sprite index)
        readonly spriteIndex: number;
        // byte (scale in 0.1's)
        readonly scale: number;
        // byte (framerate)
        readonly frameRate: number;
      }
    | {
        // #define TE_TRACER   6  // tracer effect from point to point
        readonly type: { readonly id: 6; readonly name: "TE_TRACER" };
        // coord, coord, coord (start)
        readonly start: Point;
        // coord, coord, coord (end)
        readonly end: Point;
      }
    | {
        // #define TE_LIGHTNING  7  // TE_BEAMPOINTS with simplified parameters
        readonly type: { readonly id: 7; readonly name: "TE_LIGHTNING" };
        // coord, coord, coord (start)
        readonly startPosition: Point;
        // coord, coord, coord (end)
        readonly endPosition: Point;
        // byte (life in 0.1's)
        readonly life: number;
        // byte (width in 0.1's)
        readonly width: number;
        // byte (amplitude in 0.01's)
        readonly amplitude: number;
        // short (sprite model index)
        readonly spriteModelIndex: number;
      }
    | {
        // #define TE_BEAMENTS   8
        readonly type: { readonly id: 8; readonly name: "TE_BEAMENTS" };
        // short (start entity)
        readonly startEntity: number;
        // short (end entity)
        readonly endEntity: number;
        // short (sprite index)
        readonly spriteIndex: number;
        // byte (starting frame)
        readonly startingFrame: number;
        // byte (frame rate in 0.1's)
        readonly frameRate: number;
        // byte (life in 0.1's)
        readonly life: number;
        // byte (line width in 0.1's)
        readonly lineWidth: number;
        // byte (noise amplitude in 0.01's)
        readonly noiseAmplitude: number;
        // byte,byte,byte (color)
        readonly color: {
          readonly r: number;
          readonly g: number;
          readonly b: number;
        };
        // byte (brightness)
        readonly brightness: number;
        // byte (scroll speed in 0.1's)
        readonly scrollSpeed: number;
      }
    | {
        // #define TE_SPARKS   9  // 8 random tracers with gravity, ricochet sprite
        readonly type: { readonly id: 9; readonly name: "TE_SPARKS" };
        // coord coord coord (position)
        readonly position: Point;
      }
    | {
        // #define TE_LAVASPLASH  10  // Quake1 lava splash
        readonly type: { readonly id: 10; readonly name: "TE_LAVASPLASH" };
        // coord coord coord (position)
        readonly position: Point;
      }
    | {
        // #define TE_TELEPORT   11  // Quake1 teleport splash
        readonly type: { readonly id: 11; readonly name: "TE_TELEPORT" };
        // coord coord coord (position)
        readonly position: Point;
      }
    | {
        // #define TE_EXPLOSION2  12  // Quake1 colormaped (base palette) particle explosion with sound
        readonly type: { readonly id: 12; readonly name: "TE_EXPLOSION2" };
        // coord coord coord (position)
        readonly position: Point;
        // byte (starting color)
        readonly startingColor: number;
        // byte (num colors)
        readonly numColors: number;
      }
    | {
        // #define TE_BSPDECAL   13  // Decal from the .BSP file
        readonly type: { readonly id: 13; readonly name: "TE_BSPDECAL" };
        // coord, coord, coord (x,y,z), decal position (center of texture in world)
        readonly decalPosition: Point;
        // short (texture index of precached decal texture name)
        readonly textureIndex: number;
        // short (entity index)
        readonly entityIndex: number;
        // [optional - only included if previous short is non-zero (not the world)] short (index of model of above entity)
        readonly entityModelIndex?: number;
      }
    | {
        // #define TE_IMPLOSION  14  // tracers moving toward a point
        readonly type: { readonly id: 14; readonly name: "TE_IMPLOSION" };
        // coord, coord, coord (position)
        readonly position: Point;
        // byte (radius)
        readonly radius: number;
        // byte (count)
        readonly count: number;
        // byte (life in 0.1's)
        readonly life: number;
      }
    | {
        // #define TE_SPRITETRAIL  15  // line of moving glow sprites with gravity, fadeout, and collisions
        readonly type: { readonly id: 15; readonly name: "TE_SPRITETRAIL" };
        // coord, coord, coord (start)
        readonly start: Point;
        // coord, coord, coord (end)
        readonly end: Point;
        // short (sprite index)
        readonly spriteInedx: number;
        // byte (count)
        readonly count: number;
        // byte (life in 0.1's)
        readonly life: number;
        // byte (scale in 0.1's)
        readonly scale: number;
        // byte (velocity along vector in 10's)
        readonly velocity: number;
        // byte (randomness of velocity in 10's)
        readonly velocityRandomness: number;
      }
    | {
        // #define TE_BEAM    16  // obsolete
        readonly type: { readonly id: 16; readonly name: "TE_BEAM" };
      }
    | {
        // #define TE_SPRITE   17  // additive sprite, plays 1 cycle
        readonly type: { readonly id: 17; readonly name: "TE_SPRITE" };
        // coord, coord, coord (position)
        readonly position: Point;
        // short (sprite index)
        readonly spriteIndex: number;
        // byte (scale in 0.1's)
        readonly scale: number;
        // byte (brightness)
        readonly brightness: number;
      }
    | {
        // #define TE_BEAMSPRITE  18  // A beam with a sprite at the end
        readonly type: { readonly id: 18; readonly name: "TE_BEAMSPRITE" };
        // coord, coord, coord (start position)
        readonly startPosition: Point;
        // coord, coord, coord (end position)
        readonly endPosition: Point;
        // short (beam sprite index)
        readonly beamSpriteIndex: number;
        // short (end sprite index)
        readonly endSpriteIndex: number;
      }
    | {
        // #define TE_BEAMTORUS  19  // screen aligned beam ring, expands to max radius over lifetime
        readonly type: { readonly id: 19; readonly name: "TE_BEAMTORUS" };
        // coord coord coord (center position)
        readonly centerPosition: Point;
        // coord coord coord (axis and radius)
        readonly axisRadius: Point; // TODO twice?
        // short (sprite index)
        readonly spriteIndex: number;
        // byte (starting frame)
        readonly startingFrame: number;
        // byte (frame rate in 0.1's)
        readonly frameRate: number;
        // byte (life in 0.1's)
        readonly life: number;
        // byte (line width in 0.1's)
        readonly lineWidth: number;
        // byte (noise amplitude in 0.01's)
        readonly noiseAmplitude: number;
        // byte,byte,byte (color)
        readonly color: number;
        // byte (brightness)
        readonly brightness: number;
        // byte (scroll speed in 0.1's)
        readonly scrollSpeed: number;
      }
    | {
        // #define TE_BEAMDISK   20  // disk that expands to max radius over lifetime
        readonly type: { readonly id: 20; readonly name: "TE_BEAMDISK" };
        // coord coord coord (center position)
        readonly centerPosition: Point;
        // coord coord coord (axis and radius)
        readonly axisRadius: Point;
        // short (sprite index)
        readonly spriteIndex: number;
        // byte (starting frame)
        readonly startingFrame: number;
        // byte (frame rate in 0.1's)
        readonly frameRate: number;
        // byte (life in 0.1's)
        readonly life: number;
        // byte (line width in 0.1's)
        readonly lineWidth: number;
        // byte (noise amplitude in 0.01's)
        readonly noiseAmplitude: number;
        // byte,byte,byte (color)
        readonly color: {
          readonly r: number;
          readonly g: number;
          readonly b: number;
        };
        // byte (brightness)
        readonly brightness: number;
        // byte (scroll speed in 0.1's)
        readonly scrollSpeed: number;
      }
    | {
        // #define TE_BEAMCYLINDER  21  // cylinder that expands to max radius over lifetime
        readonly type: { readonly id: 21; readonly name: "TE_BEAMCYLINDER" };
        // coord coord coord (center position)
        readonly centerPosition: Point;
        // coord coord coord (axis and radius)
        readonly axisRadius: Point;
        // short (sprite index)
        readonly spriteIndex: number;
        // byte (starting frame)
        readonly startingFrame: number;
        // byte (frame rate in 0.1's)
        readonly frameRate: number;
        // byte (life in 0.1's)
        readonly life: number;
        // byte (line width in 0.1's)
        readonly lineWidth: number;
        // byte (noise amplitude in 0.01's)
        readonly noiseAmplitude: number;
        // byte,byte,byte (color)
        readonly color: {
          readonly r: number;
          readonly g: number;
          readonly b: number;
        };
        // byte (brightness)
        readonly brightness: number;
        // byte (scroll speed in 0.1's)
        readonly scrollSpeed: number;
      }
    | {
        // #define TE_BEAMFOLLOW  22  // create a line of decaying beam segments until entity stops moving
        readonly type: { readonly id: 22; readonly name: "TE_BEAMFOLLOW" };
        // short (entity:attachment to follow)
        readonly entity: number;
        // short (sprite index)
        readonly spriteIndex: number;
        // byte (life in 0.1's)
        readonly life: number;
        // byte (line width in 0.1's)
        readonly lineWidth: number;
        // byte,byte,byte (color)
        readonly color: {
          readonly r: number;
          readonly g: number;
          readonly b: number;
        };
        // byte (brightness)
        readonly brightness: number;
      }
    | {
        // #define TE_GLOWSPRITE  23
        readonly type: { readonly id: 23; readonly name: "TE_GLOWSPRITE" };
        // coord, coord, coord (pos)
        readonly position: Point;
        // short (model index) byte (scale / 10)
        readonly modelIndex: number;
      }
    | {
        // #define TE_BEAMRING   24  // connect a beam ring to two entities
        readonly type: { readonly id: 24; readonly name: "TE_BEAMRING" };
        // short (start entity)
        readonly startEntity: number;
        // short (end entity)
        readonly endEntity: number;
        // short (sprite index)
        readonly spriteIndex: number;
        // byte (starting frame)
        readonly startingFrame: number;
        // byte (frame rate in 0.1's)
        readonly frameRate: number;
        // byte (life in 0.1's)
        readonly life: number;
        // byte (line width in 0.1's)
        readonly lineWidth: number;
        // byte (noise amplitude in 0.01's)
        readonly noiseAmplitude: number;
        // byte,byte,byte (color)
        readonly color: {
          readonly r: number;
          readonly g: number;
          readonly b: number;
        };
        // byte (brightness)
        readonly brightness: number;
        // byte (scroll speed in 0.1's)
        readonly scrollSpeed: number;
      }
    | {
        // #define TE_STREAK_SPLASH 25  // oriented shower of tracers
        readonly type: {
          readonly id: 25;
          readonly name: "TE_STREAK_SPLASH";
        };
        // coord coord coord (start position)
        readonly startPosition: Point;
        // coord coord coord (direction vector)
        readonly directionVector: Point;
        // byte (color)
        readonly color: number; // TODO just one byte?
        // short (count)
        readonly count: number;
        // short (base speed)
        readonly baseSpeed: number;
        // short (ramdon velocity)
        readonly velocityRandomness: number;
      }
    | {
        // #define TE_BEAMHOSE   26  // obsolete
        readonly type: { readonly id: 26; readonly name: "TE_BEAMHOSE" };
      }
    | {
        // #define TE_DLIGHT   27  // dynamic light, effect world, minor entity effect
        readonly type: { readonly id: 27; readonly name: "TE_DLIGHT" };
        // coord, coord, coord (pos)
        readonly position: Point;
        // byte (radius in 10's)
        readonly radius: number;
        // byte byte byte (color)
        readonly color: {
          readonly r: number;
          readonly g: number;
          readonly b: number;
        };
        // byte (brightness)
        readonly brightness: number;
        // byte (life in 10's)
        readonly life: number;
        // byte (decay rate in 10's)
        readonly decayRate: number;
      }
    | {
        // #define TE_ELIGHT   28  // point entity light, no world effect
        readonly type: { readonly id: 28; readonly name: "TE_ELIGHT" };
        // short (entity:attachment to follow)
        readonly entity: number;
        // coord coord coord (initial position)
        readonly initialPosition: Point;
        // coord (radius)
        readonly radius: number;
        // byte byte byte (color)
        readonly color: {
          readonly r: number;
          readonly g: number;
          readonly b: number;
        };
        // byte (life in 0.1's)
        readonly life: number;
        // coord (decay rate)
        readonly decayRate: number;
      }
    | {
        // #define TE_TEXTMESSAGE  29
        readonly type: { readonly id: 29; readonly name: "TE_TEXTMESSAGE" };
        // short 1.2.13 x (-1 = center)
        readonly x: number;
        // short 1.2.13 y (-1 = center)
        readonly y: number;
        // byte Effect 0 = fade in/fade out
        // 1 is flickery credits
        // 2 is write out (training room)
        readonly effect: 0 | 1 | 2;
        // 4 bytes r,g,b,a color1 (text color)
        readonly textColor: {
          readonly r: number;
          readonly g: number;
          readonly b: number;
          readonly a: number;
        };
        // 4 bytes r,g,b,a color2 (effect color)
        readonly effectColor: {
          readonly r: number;
          readonly g: number;
          readonly b: number;
          readonly a: number;
        };
        // ushort 8.8 fadein time
        readonly fadeInTime: number;
        // ushort 8.8  fadeout time
        readonly fadeOutTime: number;
        // ushort 8.8 hold time
        readonly holdTime: number;
        // optional ushort 8.8 fxtime (time the highlight lags behing the leading text in effect 2)
        readonly fxTime: number;
        // string text message  (512 chars max sz string)
        readonly textMessage: string;
      }
    | {
        // #define TE_LINE    30
        readonly type: { readonly id: 30; readonly name: "TE_LINE" };
        // coord, coord, coord  startpos
        readonly startPosition: Point;
        // coord, coord, coord  endpos
        readonly endPosition: Point;
        // short life in 0.1 s
        readonly life: number;
        // 3 bytes r, g, b
        readonly color: {
          readonly r: number;
          readonly g: number;
          readonly b: number;
        };
      }
    | {
        // #define TE_BOX    31
        readonly type: { readonly id: 31; readonly name: "TE_BOX" };
        // coord, coord, coord  boxmins
        readonly boxMins: Point;
        // coord, coord, coord  boxmaxs
        readonly boxMaxs: Point;
        // short life in 0.1 s
        readonly life: number;
        // 3 bytes r, g, b
        readonly color: {
          readonly r: number;
          readonly g: number;
          readonly b: number;
        };
      }
    | {
        // #define TE_KILLBEAM   99  // kill all beams attached to entity
        readonly type: { readonly id: 99; readonly name: "TE_KILLBEAM" };
        // short (entity)
        readonly entity: number;
      }
    | {
        // #define TE_LARGEFUNNEL  100
        readonly type: {
          readonly id: 100;
          readonly name: "TE_LARGEFUNNEL";
        };
        // coord coord coord (funnel position)
        readonly funnelPosition: Point;
        // short (sprite index)
        readonly spriteIndex: number;
        // short (flags)
        readonly flags: number;
      }
    | {
        // #define TE_BLOODSTREAM  101  // particle spray
        readonly type: {
          readonly id: 101;
          readonly name: "TE_BLOODSTREAM";
        };
        // coord coord coord (start position)
        readonly startPosition: Point;
        // coord coord coord (spray vector)
        readonly sprayVector: Point;
        // byte (color)
        readonly color: number; // TODO only one?
        // byte (speed)
        readonly speed: number;
      }
    | {
        // #define TE_SHOWLINE   102  // line of particles every 5 units, dies in 30 seconds
        readonly type: { readonly id: 102; readonly name: "TE_SHOWLINE" };
        // coord coord coord (start position)
        readonly startPosition: Point;
        // coord coord coord (end position)
        readonly endPosition: Point;
      }
    | {
        // #define TE_BLOOD   103  // particle spray
        readonly type: { readonly id: 103; readonly name: "TE_BLOOD" };
        // coord coord coord (start position)
        readonly startPosition: Point;
        // coord coord coord (spray vector)
        readonly sprayVector: Point;
        // byte (color)
        readonly color: number; // TODO only one?
        // byte (speed)
        readonly speed: number;
      }
    | {
        // #define TE_DECAL   104  // Decal applied to a brush entity (not the world)
        readonly type: { readonly id: 104; readonly name: "TE_DECAL" };
        // coord, coord, coord (x,y,z), decal position (center of texture in world)
        readonly decalPosition: Point;
        // byte (texture index of precached decal texture name)
        readonly textureIndex: number;
        // short (entity index)
        readonly entityIndex: number;
      }
    | {
        // #define TE_FIZZ    105  // create alpha sprites inside of entity, float upwards
        readonly type: { readonly id: 105; readonly name: "TE_FIZZ" };
        // short (entity)
        readonly entity: number;
        // short (sprite index)
        readonly spriteIndex: number;
        // byte (density)
        readonly density: number;
      }
    | {
        // #define TE_MODEL   106  // create a moving model that bounces and makes a sound when it hits
        readonly type: { readonly id: 106; readonly name: "TE_MODEL" };
        // coord, coord, coord (position)
        readonly position: Point;
        // coord, coord, coord (velocity)
        readonly velocity: Point;
        // angle (initial yaw)
        readonly angle: Point; // TODO what type
        // short (model index)
        readonly modelIndex: number;
        // byte (bounce sound type)
        readonly bounceSoundType: number; // TODO these constants anywhere?
        // byte (life in 0.1's)
        readonly life: number;
      }
    | {
        // #define TE_EXPLODEMODEL  107  // spherical shower of models, picks from set
        readonly type: {
          readonly id: 107;
          readonly name: "TE_EXPLODEMODEL";
        };
        // coord, coord, coord (origin)
        readonly origin: Point;
        // coord (velocity)
        readonly velocity: number; // TODO ???
        // short (model index)
        readonly modelIndex: number;
        // short (count)
        readonly count: number;
        // byte (life in 0.1's)
        readonly life: number;
      }
    | {
        // #define TE_BREAKMODEL  108  // box of models or sprites
        readonly type: { readonly id: 108; readonly name: "TE_BREAKMODEL" };
        // coord, coord, coord (position)
        readonly position: Point;
        // coord, coord, coord (size)
        readonly size: Point;
        // coord, coord, coord (velocity)
        readonly velocity: Point;
        // byte (random velocity in 10's)
        readonly velocityRandomness: number;
        // short (sprite or model index)
        readonly objectIndex: number;
        // byte (count)
        readonly count: number;
        // byte (life in 0.1 secs)
        readonly life: number;
        // byte (flags)
        readonly flags: number; // TODO where are these flags
      }
    | {
        // #define TE_GUNSHOTDECAL  109  // decal and ricochet sound
        readonly type: { readonly id: 109; readonly name: "TE_GUNSHOTDECAL" };
        // coord, coord, coord (position)
        readonly position: Point;
        // short (entity index???)
        readonly entityIndex: number;
        // byte (decal???)
        readonly decal: number;
      }
    | {
        // #define TE_SPRITE_SPRAY  110  // spay of alpha sprites
        readonly type: { readonly id: 110; readonly name: "TE_SPRITE_SPRAY" };
        // coord, coord, coord (position)
        readonly position: Point;
        // coord, coord, coord (velocity)
        readonly velocity: Point;
        // short (sprite index)
        readonly spriteIndex: number;
        // byte (count)
        readonly count: number;
        // byte (speed)
        readonly speed: number;
        // byte (noise)
        readonly noise: number;
      }
    | {
        // #define TE_ARMOR_RICOCHET 111  // quick spark sprite, client ricochet sound.
        readonly type: { readonly id: 111; readonly name: "TE_ARMOR_RICOCHET" };
        // coord, coord, coord (position)
        readonly position: Point;
        // byte (scale in 0.1's)
        readonly scale: number;
      }
    | {
        // #define TE_PLAYERDECAL  112  // ???
        readonly type: { readonly id: 112; readonly name: "TE_PLAYERDECAL" };
        // byte (playerindex)
        readonly playerIndex: number;
        // coord, coord, coord (position)
        readonly position: Point;
        // short (entity???)
        readonly entity: number;
        // byte (decal number???)
        readonly decalNumber: number;
        // [optional] short (model index???)
        readonly modelIndex?: number;
      }
    | {
        // #define TE_BUBBLES   113  // create alpha sprites inside of box, float upwards
        readonly type: { readonly id: 113; readonly name: "TE_BUBBLES" };
        // coord, coord, coord (min start position)
        readonly minStartPosition: Point;
        // coord, coord, coord (max start position)
        readonly maxStartPosition: Point;
        // coord (float height)
        readonly floatHeight: number;
        // short (model index)
        readonly modelIndex: number;
        // byte (count)
        readonly count: number;
        // coord (speed)
        readonly speed: number;
      }
    | {
        // #define TE_BUBBLETRAIL  114  // create alpha sprites along a line, float upwards
        readonly type: { readonly id: 114; readonly name: "TE_BUBBLETRAIL" };
        // coord, coord, coord (min start position)
        readonly minStartPosition: Point;
        // coord, coord, coord (max start position)
        readonly maxStartPosition: Point;
        // coord (float height)
        readonly floatHeight: number;
        // short (model index)
        readonly modelIndex: number;
        // byte (count)
        readonly count: number;
        // coord (speed)
        readonly speed: number;
      }
    | {
        // #define TE_BLOODSPRITE  115  // spray of opaque sprite1's that fall, single sprite2 for 1..2 secs (this is a high-priority tent)
        readonly type: { readonly id: 115; readonly name: "TE_BLOODSPRITE" };
        // coord, coord, coord (position)
        readonly position: Point;
        // short (sprite1 index)
        // short (sprite2 index)
        readonly spriteIndices: [number, number];
        // byte (color)
        readonly color: number;
        // byte (scale)
        readonly scale: number;
      }
    | {
        // #define TE_WORLDDECAL  116  // Decal applied to the world brush
        readonly type: { readonly id: 116; readonly name: "TE_WORLDDECAL" };
        // coord, coord, coord (x,y,z), decal position (center of texture in world)
        readonly decalPosition: Point;
        // byte (texture index of precached decal texture name)
        readonly textureIndex: number;
      }
    | {
        // #define TE_WORLDDECALHIGH 117  // Decal (with texture index > 256) applied to world brush
        readonly type: { readonly id: 117; readonly name: "TE_WORLDDECALHIGH" };
        // coord, coord, coord (x,y,z), decal position (center of texture in world)
        readonly decalPosition: Point;
        // byte (texture index of precached decal texture name - 256)
        readonly textureIndex: number;
      }
    | {
        // #define TE_DECALHIGH  118  // Same as TE_DECAL, but the texture index was greater than 256
        readonly type: { readonly id: 118; readonly name: "TE_DECALHIGH" };
        // coord, coord, coord (x,y,z), decal position (center of texture in world)
        readonly decalPosition: Point;
        // byte (texture index of precached decal texture name - 256)
        readonly textureIndex: number;
        // short (entity index)
        readonly entityIndex: number;
      }
    | {
        // #define TE_PROJECTILE  119  // Makes a projectile (like a nail) (this is a high-priority tent)
        readonly type: { readonly id: 119; readonly name: "TE_PROJECTILE" };
        // coord, coord, coord (position)
        readonly position: Point;
        // coord, coord, coord (velocity)
        readonly velocity: Point;
        // short (modelindex)
        readonly modelIndex: number;
        // byte (life)
        readonly life: number;
        // byte (owner)  projectile won't collide with owner (if owner == 0, projectile will hit any client).
        readonly owner: number;
      }
    | {
        // #define TE_SPRAY   120  // Throws a shower of sprites or models
        readonly type: { readonly id: 120; readonly name: "TE_SPRAY" };
        // coord, coord, coord (position)
        readonly position: Point;
        // coord, coord, coord (direction)
        readonly direction: Point;
        // short (modelindex)
        readonly modelIndex: number;
        // byte (count)
        readonly count: number;
        // byte (speed)
        readonly speed: number;
        // byte (noise)
        readonly noise: number;
        // byte (rendermode)
        readonly renderMode: number;
      }
    | {
        // #define TE_PLAYERSPRITES 121  // sprites emit from a player's bounding box (ONLY use for players!)
        readonly type: { readonly id: 121; readonly name: "TE_PLAYERSPRITES" };
        // byte (playernum)
        readonly playerNum: number;
        // short (sprite modelindex)
        readonly modelIndex: number;
        // byte (count)
        readonly count: number;
        // byte (variance) (0 = no variance in size) (10 = 10% variance in size)
        readonly variance: number;
      }
    | {
        // #define TE_PARTICLEBURST 122  // very similar to lavasplash.
        readonly type: { readonly id: 122; readonly name: "TE_PARTICLEBURST" };
        // coord (origin)
        readonly origin: number; // TODO
        // short (radius)
        readonly radius: number;
        // byte (particle color)
        readonly particleColor: number;
        // byte (duration * 10) (will be randomized a bit)
        readonly duration: number;
      }
    | {
        // #define TE_FIREFIELD   123  // makes a field of fire.
        readonly type: { readonly id: 123; readonly name: "TE_FIREFIELD" };
        // coord (origin)
        readonly origin: number; // TODO
        // short (radius) (fire is made in a square around origin. -radius, -radius to radius, radius)
        readonly radius: number;
        // short (modelindex)
        readonly modelIndex: number;
        // byte (count)
        readonly count: number;
        // byte (flags)
        // to keep network traffic low, this message has associated flags that fit into a byte:
        // #define TEFIRE_FLAG_ALLFLOAT 1 // all sprites will drift upwards as they animate
        // #define TEFIRE_FLAG_SOMEFLOAT 2 // some of the sprites will drift upwards. (50% chance)
        // #define TEFIRE_FLAG_LOOP  4 // if set, sprite plays at 15 fps, otherwise plays at whatever rate stretches the animation over the sprite's duration.
        // #define TEFIRE_FLAG_ALPHA  8 // if set, sprite is rendered alpha blended at 50% else, opaque
        // #define TEFIRE_FLAG_PLANAR  16 // if set, all fire sprites have same initial Z instead of randomly filling a cube.
        // #define TEFIRE_FLAG_ADDITIVE 32 // if set, sprite is rendered non-opaque with additive
        readonly flags: number;
        // byte (duration (in seconds) * 10) (will be randomized a bit)
        readonly duration: number;
      }
    | {
        // #define TE_PLAYERATTACHMENT   124 // attaches a TENT to a player (this is a high-priority tent)
        readonly type: {
          readonly id: 124;
          readonly name: "TE_PLAYERATTACHMENT";
        };
        // byte (entity index of player)
        readonly entityIndex: number;
        // coord (vertical offset) ( attachment origin.z = player origin.z + vertical offset )
        readonly verticleOffset: number; // TODO
        // short (model index)
        readonly modelIndex: number;
        // short (life * 10 );
        readonly life: number;
      }
    | {
        // #define TE_KILLPLAYERATTACHMENTS 125 // will expire all TENTS attached to a player.
        readonly type: {
          readonly id: 125;
          readonly name: "TE_KILLPLAYERATTACHMENTS";
        };
        // byte (entity index of player)
        readonly entityIndex: number;
      }
    | {
        // #define TE_MULTIGUNSHOT    126 // much more compact shotgun message
        // This message is used to make a client approximate a 'spray' of gunfire.
        // Any weapon that fires more than one bullet per frame and fires in a bit of a spread is
        // a good candidate for MULTIGUNSHOT use. (shotguns)
        // NOTE: This effect makes the client do traces for each bullet, these client traces ignore
        //   entities that have studio models.Traces are 4096 long.
        readonly type: { readonly id: 126; readonly name: "TE_MULTIGUNSHOT" };
        // coord (origin)
        // coord (origin)
        // coord (origin)
        readonly origin: Point;
        // coord (direction)
        // coord (direction)
        // coord (direction)
        readonly direction: Point;
        // coord (x noise * 100)
        // coord (y noise * 100)
        readonly noise: { readonly x: number; readonly y: number }; // TODO
        // byte (count)
        readonly count: number;
        // byte (bullethole decal texture index)
        readonly bulletHoleDecalTextureIndex: number;
      }
    | {
        // #define TE_USERTRACER    127 // larger message than the standard tracer, but allows some customization.
        readonly type: { readonly id: 127; readonly name: "TE_USERTRACER" };
        // coord (origin)
        // coord (origin)
        // coord (origin)
        readonly origin: Point;
        // coord (velocity)
        // coord (velocity)
        // coord (velocity)
        readonly velocity: Point;
        // byte ( life * 10 )
        readonly life: number;
        // byte ( color ) this is an index into an array of color vectors in the engine. (0 - )
        readonly color: number;
        // byte ( length * 10 )
        readonly length: number;
      };
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

const mapTypeIdToType: (typeId: number) => TempEntity["fields"]["type"] = (
  typeId
) =>
  ({
    id: typeId,
    name: TempEntityType[typeId],
  } as TempEntity["fields"]["type"]); // HACK

export const tempEntity: B.BufferParser<TempEntity> = pipe(
  B.uint8_le,
  P.map(mapTypeIdToType),
  P.chainFirst((type) =>
    pipe(
      ((): P.Parser<number, number> => {
        switch (type.name) {
          case "TE_BEAMPOINTS":
            return P.of(24);

          case "TE_BEAMENTPOINT":
            return P.of(20);

          case "TE_GUNSHOT":
            return P.of(6);

          case "TE_EXPLOSION":
            return P.of(11);

          case "TE_TAREXPLOSION":
            return P.of(6);

          case "TE_SMOKE":
            return P.of(10);

          case "TE_TRACER":
            return P.of(12);

          case "TE_LIGHTNING":
            return P.of(17);

          case "TE_BEAMENTS":
            return P.of(16);

          case "TE_SPARKS":
            return P.of(6);

          case "TE_LAVASPLASH":
            return P.of(6);

          case "TE_TELEPORT":
            return P.of(6);

          case "TE_EXPLOSION2":
            return P.of(8);

          case "TE_BSPDECAL":
            return pipe(
              P.skip<number>(8),
              P.apSecond(B.int16_le),
              P.filter((entityIndex) => entityIndex !== 0),
              P.map(() => 2),
              P.alt(() => P.of(0))
            );

          case "TE_IMPLOSION":
            return P.of(9);

          case "TE_SPRITETRAIL":
            return P.of(19);

          case "TE_SPRITE":
            return P.of(10);

          case "TE_BEAMSPRITE":
            return P.of(16);

          case "TE_BEAMTORUS":
            return P.of(24);

          case "TE_BEAMDISK":
            return P.of(24);

          case "TE_BEAMCYLINDER":
            return P.of(24);

          case "TE_BEAMFOLLOW":
            return P.of(10);

          case "TE_GLOWSPRITE":
            return P.of(11);

          case "TE_BEAMRING":
            return P.of(16);

          case "TE_STREAK_SPLASH":
            return P.of(19);

          case "TE_DLIGHT":
            return P.of(12);

          case "TE_ELIGHT":
            return P.of(16);

          case "TE_TEXTMESSAGE":
            return pipe(
              P.skip<number>(8 + 16 + 16),
              P.apSecond(B.int8_le),
              P.apFirst(P.skip(8 + 8 + 8 + 8 + 8 + 8 + 8 + 8 + 16 + 16 + 16)),
              P.filter((effect) => effect !== 0),
              P.apSecond(P.skip(16)),
              P.alt(() => P.of<number, void>(undefined)),
              P.chain(() => B.ztstr),
              P.map(() => 0)
            );

          case "TE_LINE":
            return P.of(17);

          case "TE_BOX":
            return P.of(17);

          case "TE_KILLBEAM":
            return P.of(2);

          case "TE_LARGEFUNNEL":
            return P.of(10);

          case "TE_BLOODSTREAM":
            return P.of(14);

          case "TE_SHOWLINE":
            return P.of(12);

          case "TE_BLOOD":
            return P.of(14);

          case "TE_DECAL":
            return P.of(9);

          case "TE_FIZZ":
            return P.of(5);

          case "TE_MODEL":
            return P.of(17);

          case "TE_EXPLODEMODEL":
            return P.of(13);

          case "TE_BREAKMODEL":
            return P.of(24);

          case "TE_GUNSHOTDECAL":
            return P.of(9);

          case "TE_SPRITE_SPRAY":
            return P.of(17);

          case "TE_ARMOR_RICOCHET":
            return P.of(7);

          case "TE_PLAYERDECAL":
            return P.of(10);

          case "TE_BUBBLES":
            return P.of(19);

          case "TE_BUBBLETRAIL":
            return P.of(19);

          case "TE_BLOODSPRITE":
            return P.of(12);

          case "TE_WORLDDECAL":
            return P.of(7);

          case "TE_WORLDDECALHIGH":
            return P.of(7);

          case "TE_DECALHIGH":
            return P.of(9);

          case "TE_PROJECTILE":
            return P.of(16);

          case "TE_SPRAY":
            return P.of(18);

          case "TE_PLAYERSPRITES":
            return P.of(5);

          case "TE_PARTICLEBURST":
            return P.of(10);

          case "TE_FIREFIELD":
            return P.of(9);

          case "TE_PLAYERATTACHMENT":
            return P.of(7);

          case "TE_KILLPLAYERATTACHMENTS":
            return P.of(1);

          case "TE_MULTIGUNSHOT":
            return P.of(18);

          case "TE_USERTRACER":
            return P.of(15);

          default:
            return P.cut(P.fail());
        }
      })(),
      P.chain((tempEntityLength) => P.skip<number>(tempEntityLength))
    )
  ),

  P.map(
    (fields) =>
      ({
        id: MessageType.SVC_TEMPENTITY,
        name: "SVC_TEMPENTITY",
        fields,

        // TODO add parsing of entity types
      } as unknown as TempEntity)
  )
);
