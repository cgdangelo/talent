import * as BB from "@talent/parser-bitbuffer";
import * as P from "@talent/parser/lib/Parser";
import { map, option as O, readonlyArray as RA, string } from "fp-ts";
import { constant, flow, pipe } from "fp-ts/lib/function";

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

type DeltaFieldDecoder = {
  readonly bits: number;
  readonly divisor: number;
  readonly flags: DeltaType;
  readonly name: string;
  readonly offset?: number;
  readonly preMultiplier?: number;
  readonly size?: number;
};

type DeltaDecoder = DeltaFieldDecoder[];

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

type DeltaField<A> = P.Parser<number, [fieldName: string, value: A]>;

type DeltaFieldParser<A> = (
  deltaFieldDecoder: DeltaFieldDecoder
) => DeltaField<A>;

const fieldHasFlag: (fieldFlags: DeltaType) => (flags: DeltaType) => boolean =
  (fieldFlags) => (flags) =>
    (fieldFlags & flags) !== 0;

const isNumericField = fieldHasFlag(
  DeltaType.BYTE |
    DeltaType.SHORT |
    DeltaType.INTEGER |
    DeltaType.FLOAT |
    DeltaType.TIMEWINDOW_8 |
    DeltaType.TIMEWINDOW_BIG
);

const isSignedField = fieldHasFlag(DeltaType.SIGNED);

const isAngleField = fieldHasFlag(DeltaType.ANGLE);

const isStringField = fieldHasFlag(DeltaType.STRING);

const decodeSigned: DeltaFieldParser<number> = (deltaFieldDecoder) =>
  pipe(
    P.struct({
      sign: pipe(
        BB.ubits(1),
        P.map((a) => (a !== 0 ? -1 : 1))
      ),
      value: BB.ubits(deltaFieldDecoder.bits - 1),
    }),

    P.map(({ sign, value }) => [
      deltaFieldDecoder.name,
      (sign * value) / deltaFieldDecoder.divisor,
    ])
  );

const decodeUnsigned: DeltaFieldParser<number> = (deltaFieldDecoder) =>
  pipe(
    BB.ubits(deltaFieldDecoder.bits),
    P.map((value) => [
      deltaFieldDecoder.name,
      value / deltaFieldDecoder.divisor,
    ])
  );

const decodeAngle: DeltaFieldParser<number> = (deltaFieldDecoder) =>
  pipe(
    BB.ubits(deltaFieldDecoder.bits),
    P.map((value) => [
      deltaFieldDecoder.name,
      value * (360 / (1 << deltaFieldDecoder.bits)),
    ])
  );

const decodeString: DeltaFieldParser<string> = (deltaFieldDecoder) =>
  pipe(
    BB.ztstr,
    P.map((value) => [deltaFieldDecoder.name, value])
  );

const numericField: (
  fieldFlags: DeltaType
) => O.Option<DeltaFieldParser<number>> = flow(
  O.fromPredicate(isNumericField),
  O.chain(
    flow(
      O.fromPredicate(isSignedField),
      O.map(constant(decodeSigned)),
      O.alt(() => O.some(decodeUnsigned))
    )
  )
);

const angleField: (
  fieldFlags: DeltaType
) => O.Option<DeltaFieldParser<number>> = flow(
  O.fromPredicate(isAngleField),
  O.map(constant(decodeAngle))
);

const stringField: (
  fieldFlags: DeltaType
) => O.Option<DeltaFieldParser<string>> = flow(
  O.fromPredicate(isStringField),
  O.map(constant(decodeString))
);

const readField: (
  fieldIndex: number,
  deltaDecoder: DeltaDecoder
) => P.Parser<number, [fieldName: string, value: number | string]> = (
  fieldIndex,
  deltaDecoder
) =>
  pipe(
    deltaDecoder,
    RA.lookup(fieldIndex),
    O.chain((deltaFieldDecoder) =>
      pipe(
        O.some(deltaFieldDecoder.flags),
        O.chain(numericField),
        O.alt(() => pipe(deltaFieldDecoder.flags, angleField)),
        O.altW(() => pipe(deltaFieldDecoder.flags, stringField)),
        O.map((deltaFieldParser) => deltaFieldParser(deltaFieldDecoder))
      )
    ),
    O.getOrElseW(() => P.fail<number>())
  );

const lookupDecoder = map.lookup(string.Eq);

const maskBits: (maskBitLength: number) => P.Parser<number, readonly number[]> =
  (maskBitLength) => P.manyN(BB.ubits(8), maskBitLength);

export const readDelta: (
  deltaDecoderName: string
) => P.Parser<number, DeltaFieldDecoder> = (deltaDecoderName: string) =>
  pipe(
    BB.ubits(3),
    P.chain(maskBits),
    P.chain((maskBits) =>
      pipe(
        lookupDecoder(deltaDecoderName)(deltaDecoders),
        O.map(
          flow(
            (deltaDecoder) => {
              const fields: DeltaField<unknown>[] = [];

              for (let i = 0; i < maskBits.length; ++i) {
                pipe(
                  RA.makeBy(8, (j) => j + i * 8),
                  RA.filterMapWithIndex((index, j) => {
                    if (index >= deltaDecoder.length) return O.none;

                    if ((maskBits[i] ?? 0) & (1 << j))
                      return O.some(readField(index, deltaDecoder));

                    return O.none;
                  }),
                  RA.map((fieldParser) => fields.push(fieldParser))
                );
              }

              return fields;
            },
            RA.sequence(P.Applicative),
            P.map(Object.fromEntries)
          )
        ),
        O.getOrElse(() => P.fail())
      )
    )
  );
