import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import * as P from '@cgdangelo/talent-parser/lib/Parser';
import { pipe } from 'fp-ts/lib/function';
import { MessageType } from '../MessageType';

export type WeaponAnim = {
  readonly id: MessageType.SVC_WEAPONANIM;
  readonly name: 'SVC_WEAPONANIM';

  readonly fields: {
    readonly sequenceNumber: number;
    readonly weaponModelBodyGroup: number;
  };
};

export const weaponAnim: B.BufferParser<WeaponAnim> = pipe(
  P.struct({ sequenceNumber: B.int8_le, weaponModelBodyGroup: B.int8_le }),

  P.map((fields) => ({
    id: MessageType.SVC_WEAPONANIM,
    name: 'SVC_WEAPONANIM',
    fields
  }))
);
