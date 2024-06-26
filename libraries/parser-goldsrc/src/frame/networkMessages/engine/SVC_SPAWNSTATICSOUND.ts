import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import * as P from '@cgdangelo/talent-parser/lib/Parser';
import { pipe } from 'fp-ts/lib/function';
import { type Point } from '../../../Point';
import { pointBy } from '../../../Point';
import { MessageType } from '../MessageType';

export type SpawnStaticSound = {
  readonly id: MessageType.SVC_SPAWNSTATICSOUND;
  readonly name: 'SVC_SPAWNSTATICSOUND';

  readonly fields: {
    readonly origin: Point;
    readonly soundIndex: number;
    readonly volume: number;
    readonly attenuation: number;
    readonly entityIndex: number;
    readonly pitch: number;
    readonly flags: number;
  };
};

export const spawnStaticSound: B.BufferParser<SpawnStaticSound> = pipe(
  P.struct({
    origin: pointBy(
      pipe(
        B.int16_le,
        P.map((a) => a / 8)
      )
    ),
    soundIndex: B.uint16_le,
    volume: pipe(
      B.uint8,
      P.map((a) => a / 255)
    ),
    attenuation: pipe(
      B.uint8,
      P.map((a) => a / 64)
    ),
    entityIndex: B.uint16_le,
    pitch: B.uint8,

    // TODO Find all the SND_, VOL_ ATTN_, PITCH_ flags?
    // https://forums.alliedmods.net/showthread.php?t=234965
    // https://forums.alliedmods.net/showpost.php?p=2455441&postcount=8
    // https://github.com/baso88/SC_AngelScript/wiki/SoundSystem
    flags: B.uint8
  }),

  P.map((fields) => ({
    id: MessageType.SVC_SPAWNSTATICSOUND,
    name: 'SVC_SPAWNSTATICSOUND',
    fields
  }))
);
