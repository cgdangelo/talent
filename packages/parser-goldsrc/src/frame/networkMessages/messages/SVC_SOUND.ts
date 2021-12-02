import * as BB from "@talent/parser-bitbuffer";
import type { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { stream } from "@talent/parser/lib/Stream";
import { pipe } from "fp-ts/lib/function";

export type Sound = {
  readonly volume?: number;
  readonly attenuation?: number;
  readonly channel: number;
  readonly entityIndex: number;
  readonly soundIndex: number;
  readonly origin: {
    readonly x?: number;
    readonly y?: number;
    readonly z?: number;
  };
  readonly pitch?: number;
};

const volume: (flags: number) => B.BufferParser<number | undefined> = (flags) =>
  pipe(
    P.of<number, number>(flags),
    P.filter((flags) => (flags & 1) !== 0),
    P.apSecond(BB.ubits(8)),
    P.map((a) => a / 255),
    P.alt(() => P.of<number, number | undefined>(undefined))
  );

const attenuation: (flags: number) => B.BufferParser<number | undefined> = (
  flags
) =>
  pipe(
    P.of<number, number>(flags),
    P.filter((flags) => (flags & 2) !== 0),
    P.apSecond(BB.ubits(8)),
    P.map((a) => a / 64),
    P.alt(() => P.of<number, number | undefined>(undefined))
  );

const channel: B.BufferParser<number> = BB.ubits(3);

const entityIndex: B.BufferParser<number> = BB.ubits(11);

const soundIndex: (flags: number) => B.BufferParser<number> = (flags) =>
  pipe(
    P.of<number, number>(flags),
    P.filter((flags) => (flags & 4) !== 0),
    P.apSecond(BB.ubits(16)),
    P.alt(() => BB.ubits(8))
  );

const originAxisValue: B.BufferParser<number | undefined> = pipe(
  P.struct({ intFlag: BB.ubits(1), fractionFlag: BB.ubits(1) }),
  P.filter(({ intFlag, fractionFlag }) => intFlag + fractionFlag !== 0),
  P.chain(({ intFlag, fractionFlag }) =>
    pipe(
      BB.ubits(1),
      P.chain((sign) =>
        pipe(
          P.struct({
            intValue: pipe(
              P.of<number, number>(intFlag),
              P.filter((intFlag) => intFlag !== 0),
              P.apSecond(BB.ubits(12)),
              P.alt(() => P.of(0))
            ),

            fractionValue: pipe(
              P.of<number, number>(fractionFlag),
              P.filter((fractionFlag) => fractionFlag !== 0),
              P.apSecond(BB.ubits(3)),
              P.alt(() => P.of(0))
            ),
          }),

          P.map(
            ({ intValue, fractionValue }) =>
              (intValue + fractionValue / 32) * (sign !== 0 ? -1 : 1)
          )
        )
      )
    )
  ),

  P.alt(() => P.of(0))
);

const origin: B.BufferParser<{
  readonly x?: number;
  readonly y?: number;
  readonly z?: number;
}> = pipe(
  P.struct({
    x: BB.bits(1),
    y: BB.bits(1),
    z: BB.bits(1),
  }),

  P.chain(({ x, y, z }) =>
    P.struct({
      x: x !== 0 ? originAxisValue : P.of(x),
      y: y !== 0 ? originAxisValue : P.of(y),
      z: z !== 0 ? originAxisValue : P.of(z),
    })
  )
);

const pitch: (flags: number) => B.BufferParser<number | undefined> = (flags) =>
  pipe(
    P.of<number, number>(flags),
    P.filter((flags) => (flags & 8) !== 0),
    P.apSecond(BB.ubits(8))
  );

export const sound: B.BufferParser<Sound> = (i) =>
  pipe(
    stream(i.buffer, i.cursor * 8),

    pipe(
      BB.ubits(9),
      P.chain((flags) =>
        P.struct({
          volume: volume(flags),
          attenuation: attenuation(flags),
          channel,
          entityIndex,
          soundIndex: soundIndex(flags),
          origin,
          pitch: pitch(flags),
        })
      ),
      BB.nextByte
    )
  );
