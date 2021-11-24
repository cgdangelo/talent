import * as BB from "@talent/parser-bitbuffer";
import * as P from "@talent/parser/lib/Parser";
import { option as O, readonlyArray as RA } from "fp-ts";
import { pipe } from "fp-ts/lib/function";

enum DeltaType {
  BYTE = 1,
  SHORT = 1 << 1,
  FLOAT = 1 << 2,
  INTEGER = 1 << 3,
  ANGLE = 1 << 4,
  TIMEWINDOW_8 = 1 << 5,
  TIMEWINDOW_BIG = 1 << 6,
  STRING = 1 << 7,
  SIGNED = 1 << 31,
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
        flags: DeltaType.INTEGER,
      },
      {
        name: "name",
        bits: 8,
        divisor: 1,
        flags: DeltaType.STRING,
      },
      {
        name: "offset",
        bits: 16,
        divisor: 1,
        flags: DeltaType.INTEGER,
      },
      {
        name: "size",
        bits: 8,
        divisor: 1,
        flags: DeltaType.INTEGER,
      },
      {
        name: "bits",
        bits: 8,
        divisor: 1,
        flags: DeltaType.INTEGER,
      },
      {
        name: "divisor",
        bits: 32,
        divisor: 4000,
        flags: DeltaType.FLOAT,
      },
      {
        name: "preMultiplier",
        bits: 32,
        divisor: 4000,
        flags: DeltaType.FLOAT,
      },
    ],
  ],
]);

type DeltaDecoderFieldParser<A> = (
  deltaDecoderField: DeltaDecoderField
) => P.Parser<number, [fieldName: string, value: A]>;

const signedField: DeltaDecoderFieldParser<number> = (deltaDecoderField) =>
  pipe(
    P.struct({
      sign: pipe(
        BB.ubits(1),
        P.map((a) => (a !== 0 ? -1 : 1))
      ),
      value: BB.ubits(deltaDecoderField.bits - 1),
    }),

    P.map(({ sign, value }) => [
      deltaDecoderField.name,
      (sign * value) / deltaDecoderField.divisor,
    ])
  );

const unsignedField: DeltaDecoderFieldParser<number> = (deltaDecoderField) =>
  pipe(
    BB.ubits(deltaDecoderField.bits),
    P.map((value) => [
      deltaDecoderField.name,
      value / deltaDecoderField.divisor,
    ])
  );

const angle: DeltaDecoderFieldParser<number> = (deltaDecoderField) =>
  pipe(
    BB.ubits(deltaDecoderField.bits),
    P.map((value) => [
      deltaDecoderField.name,
      value * (360 / (1 << deltaDecoderField.bits)),
    ])
  );

const string: DeltaDecoderFieldParser<string> = (deltaDecoderField) =>
  pipe(
    BB.ztstr,
    P.map((value) => [deltaDecoderField.name, value])
  );

const readField: (
  fieldIndex: number,
  deltaDecoder: DeltaDecoder
) => P.Parser<number, [fieldName: string, value: unknown]> = (
  fieldIndex,
  deltaDecoder
) =>
  pipe(
    deltaDecoder,
    RA.lookup(fieldIndex),
    O.map((deltaDecoderField) => {
      if (
        deltaDecoderField.flags &
        (DeltaType.BYTE |
          DeltaType.SHORT |
          DeltaType.INTEGER |
          DeltaType.FLOAT |
          DeltaType.TIMEWINDOW_8 |
          DeltaType.TIMEWINDOW_BIG)
      ) {
        if (deltaDecoderField.flags & DeltaType.SIGNED) {
          return signedField(deltaDecoderField);
        } else {
          return unsignedField(deltaDecoderField);
        }
      } else if (deltaDecoderField.flags & DeltaType.ANGLE) {
        return angle(deltaDecoderField);
      } else if (deltaDecoderField.flags & DeltaType.STRING) {
        return string(deltaDecoderField);
      }

      return P.fail<number>();
    }),
    O.getOrElse(() => P.fail())
  );

export const readDelta: (
  deltaDecoderName: string
) => P.Parser<number, DeltaDecoderField> = (deltaDecoderName: string) =>
  pipe(
    BB.ubits(3),

    P.chain((maskBitCount) => P.manyN(BB.ubits(8), maskBitCount)),

    P.chain((maskBits) => {
      const deltaDecoder = deltaDecoders.get(deltaDecoderName);

      if (deltaDecoder == null) return P.fail();

      const fieldParsers: ReturnType<typeof readField>[] = [];

      let b = false;

      for (let i = 0; i < maskBits.length; ++i) {
        for (let j = 0; j < 8; ++j) {
          const index = j + i * 8;

          if (index >= deltaDecoder.length) {
            b = true;
            break;
          }

          if (maskBits[i]! & (1 << j)) {
            fieldParsers.push(readField(index, deltaDecoder));
          }
        }

        if (b) break;
      }

      return pipe(
        RA.sequence(P.Applicative)(fieldParsers),
        P.map(Object.fromEntries)
      );
    })
  );
