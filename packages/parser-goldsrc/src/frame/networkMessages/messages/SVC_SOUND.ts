import * as BB from "@talent/parser-bitbuffer";
import type { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { stream } from "@talent/parser/lib/Stream";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "../../../Point";
import type { MessageType } from "../MessageType";

export type Sound = {
  readonly type: {
    readonly id: MessageType.SVC_SOUND;
    readonly name: "SVC_SOUND";
  };

  readonly fields: {
    readonly volume?: number;
    readonly attenuation?: number;
    readonly channel: number;
    readonly entityIndex: number;
    readonly soundIndex: number;
    readonly origin: Partial<Point>;
    readonly pitch: number;
  };
};

const volume: (flags: number) => B.BufferParser<Sound["fields"]["volume"]> = (
  flags
) =>
  (flags & 1) !== 0
    ? pipe(
        BB.ubits(8),
        P.map((a) => a / 255)
      )
    : P.of(undefined);

const attenuation: (
  flags: number
) => B.BufferParser<Sound["fields"]["attenuation"]> = (flags) =>
  (flags & 2) !== 0
    ? pipe(
        BB.ubits(8),
        P.map((a) => a / 64)
      )
    : P.of(undefined);

const channel: B.BufferParser<Sound["fields"]["channel"]> = BB.ubits(3);

const entityIndex: B.BufferParser<Sound["fields"]["entityIndex"]> =
  BB.ubits(11);

const soundIndex: (
  flags: number
) => B.BufferParser<Sound["fields"]["soundIndex"]> = (flags) =>
  (flags & 4) !== 0 ? BB.ubits(16) : BB.ubits(8);

const originAxisValue: B.BufferParser<
  Sound["fields"]["origin"][keyof Sound["fields"]["origin"]]
> = pipe(
  P.struct({ intFlag: BB.ubits(1), fractionFlag: BB.ubits(1) }),
  P.filter(({ intFlag, fractionFlag }) => intFlag + fractionFlag !== 0),
  P.chain(({ intFlag, fractionFlag }) =>
    pipe(
      BB.ubits(1),
      P.chain((isNegative) =>
        pipe(
          P.struct({
            intValue: intFlag !== 0 ? BB.ubits(12) : P.of(0),
            fractionValue: fractionFlag !== 0 ? BB.ubits(3) : P.of(0),
          }),

          P.map(
            ({ intValue, fractionValue }) =>
              (intValue + fractionValue / 32) * (isNegative !== 0 ? -1 : 1)
          )
        )
      )
    )
  ),

  P.alt(() => pipe(P.of<number, number>(0), P.apFirst(P.skip(2))))
);

const origin: B.BufferParser<Sound["fields"]["origin"]> = pipe(
  P.struct({
    x: BB.bits(1),
    y: BB.bits(1),
    z: BB.bits(1),
  }),

  P.chain(({ x, y, z }) =>
    P.struct({
      x: x !== 0 ? originAxisValue : P.of(undefined),
      y: y !== 0 ? originAxisValue : P.of(undefined),
      z: z !== 0 ? originAxisValue : P.of(undefined),
    })
  )
);

const pitch: (flags: number) => B.BufferParser<Sound["fields"]["pitch"]> = (
  flags
) => ((flags & 8) !== 0 ? BB.ubits(8) : P.of(1));

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
      BB.nextByte,

      P.map((fields) => ({
        type: { id: 5, name: "SVC_SOUND" } as const,
        fields,
      }))
    )
  );
