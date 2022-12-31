import { parser as P } from '@cgdangelo/talent-parser';
import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import { pipe } from 'fp-ts/lib/function';
import { TempEntityType } from './TempEntityType';

enum TE_TEXTMESSAGE_FX {
  FadeInOut = 0,
  Credits = 1 << 0,
  WriteOut = 1 << 1
}

export type TextMessage = {
  readonly id: TempEntityType.TE_TEXTMESSAGE;
  readonly name: 'TE_TEXTMESSAGE';
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

export const textMessage: B.BufferParser<TextMessage> = pipe(
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
      )
    }),
    effect: pipe(
      B.uint8_le,
      P.filter((a): a is TE_TEXTMESSAGE_FX => a === 0 || a === 1 || a === 2)
    ),
    textColor: P.struct({
      r: B.uint8_le,
      g: B.uint8_le,
      b: B.uint8_le,
      a: B.uint8_le
    }),
    effectColor: P.struct({
      r: B.uint8_le,
      g: B.uint8_le,
      b: B.uint8_le,
      a: B.uint8_le
    }),
    fadeIn: pipe(
      B.int16_le
      // P.map((a) => a / 256)
    ),
    fadeOut: pipe(
      B.int16_le
      // P.map((a) => a / 256)
    ),
    hold: B.int16_le
  }),

  P.bind('fxTime', ({ effect }) =>
    effect === TE_TEXTMESSAGE_FX.WriteOut
      ? pipe(
          B.int16_le
          // P.map((a) => a / 256)
        )
      : P.of(undefined)
  ),

  P.bind('textMessage', () => B.ztstr),

  P.map((fields) => ({
    id: TempEntityType.TE_TEXTMESSAGE,
    name: 'TE_TEXTMESSAGE',
    fields
  }))
);
