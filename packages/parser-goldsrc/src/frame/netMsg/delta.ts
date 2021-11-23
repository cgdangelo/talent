import * as BB from "@talent/parser-bitbuffer";
import * as P from "@talent/parser/lib/Parser";
import { readonlyArray as RA } from "fp-ts";
import { pipe } from "fp-ts/lib/function";

enum DeltaType {
  DT_BYTE = 1,
  DT_SHORT = 1 << 1,
  DT_FLOAT = 1 << 2,
  DT_INTEGER = 1 << 3,
  DT_ANGLE = 1 << 4,
  DT_TIMEWINDOW_8 = 1 << 5,
  DT_TIMEWINDOW_BIG = 1 << 6,
  DT_STRING = 1 << 7,
  DT_SIGNED = 1 << 31,
}

type DeltaDecoderField = {
  readonly bits: number;
  readonly divisor: number;
  readonly flags: DeltaType;
  readonly name: string;
  readonly offset?: number;
  readonly preMultiplier?: number;
  readonly size?: number;
};

type DeltaDecoder = DeltaDecoderField[];

// FIXME HACK FIXME HACK mutable shared state
export const deltaDecoders: Map<string, DeltaDecoder> = new Map([
  [
    "delta_description_t",
    [
      {
        name: "flags",
        bits: 32,
        divisor: 1,
        flags: DeltaType.DT_INTEGER,
      },
      {
        name: "name",
        bits: 8,
        divisor: 1,
        flags: DeltaType.DT_STRING,
      },
      {
        name: "offset",
        bits: 16,
        divisor: 1,
        flags: DeltaType.DT_INTEGER,
      },
      {
        name: "size",
        bits: 8,
        divisor: 1,
        flags: DeltaType.DT_INTEGER,
      },
      {
        name: "bits",
        bits: 8,
        divisor: 1,
        flags: DeltaType.DT_INTEGER,
      },
      {
        name: "divisor",
        bits: 32,
        divisor: 4000,
        flags: DeltaType.DT_FLOAT,
      },
      {
        name: "preMultiplier",
        bits: 32,
        divisor: 4000,
        flags: DeltaType.DT_FLOAT,
      },
    ],
  ],
]);

const readField = (
  index: number,
  deltaDecoder: DeltaDecoder
): P.Parser<number, { [fieldName: string]: string | number }> => {
  if (
    deltaDecoder[index]!.flags &
    (DeltaType.DT_BYTE |
      DeltaType.DT_SHORT |
      DeltaType.DT_INTEGER |
      DeltaType.DT_FLOAT |
      DeltaType.DT_TIMEWINDOW_8 |
      DeltaType.DT_TIMEWINDOW_BIG)
  ) {
    if (deltaDecoder[index]!.flags & DeltaType.DT_SIGNED) {
      return pipe(
        P.struct({
          sign: pipe(
            BB.ubits(1),
            P.map((a) => (a ? -1 : 1))
          ),
          value: BB.ubits(deltaDecoder[index]!.bits - 1),
          divisor: P.of(deltaDecoder[index]!.divisor),
        }),

        P.map(({ sign, value, divisor }) => ({
          [deltaDecoder[index]!.name]: (sign * value) / divisor,
        }))
      );
    } else {
      return pipe(
        BB.ubits(deltaDecoder[index]!.bits),
        P.map((value) => ({
          [deltaDecoder[index]!.name]: value / deltaDecoder[index]!.divisor,
        }))
      );
    }
  } else if (deltaDecoder[index]!.flags & DeltaType.DT_ANGLE) {
    return pipe(
      BB.ubits(deltaDecoder[index]!.bits),
      P.map((value) => ({
        [deltaDecoder[index]!.name]:
          value * (360 / (1 << deltaDecoder[index]!.bits)),
      }))
    );
  } else if (deltaDecoder[index]!.flags & DeltaType.DT_STRING) {
    return P.struct({ [deltaDecoder[index]!.name]: BB.ztstr });
  }

  return P.succeed({});
};

export const readDelta = (deltaDecoder: DeltaDecoder) =>
  pipe(
    BB.ubits(3),

    P.chain((maskBitCount) => P.manyN(BB.ubits(8), maskBitCount)),

    P.chain((maskBits) => {
      const fieldParsers: ReturnType<typeof readField>[] = [];

      for (let i = 0; i < maskBits.length; ++i) {
        for (let j = 0; j < 8; ++j) {
          const index = j + i * 8;

          if (index === deltaDecoder.length) break;

          if (maskBits[i]! & (1 << j)) {
            fieldParsers.push(readField(index, deltaDecoder));
          }
        }
      }

      return pipe(
        RA.sequence(P.Applicative)(fieldParsers),
        P.map(RA.reduce({}, (acc, cur) => ({ ...acc, ...cur }))),
        P.map((a) => a as DeltaDecoderField)
      );
    })
  );
