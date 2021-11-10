import * as P from "@talent/parser/lib/Parser";
import { manyN, skip, take } from "@talent/parser/lib/Parser";
import { success } from "@talent/parser/lib/ParseResult";
import { stream } from "@talent/parser/lib/Stream";
import { either as E } from "fp-ts";
import { flow, pipe } from "fp-ts/lib/function";

export type BufferParser<A> = P.Parser<number, A>;

const int: (
  fa: Buffer["readIntLE" | "readUIntLE" | "readIntBE" | "readUIntBE"]
) => (bitLength: BitLength) => BufferParser<number> = (fa) => (bitLength) =>
  pipe(
    take<number>(bitLength / 8),
    P.map((as) => Buffer.from(as)),
    P.chain((buffer) =>
      pipe(
        E.tryCatch(() => fa.call(buffer, 0, buffer.length), E.toError),
        E.match(
          () => P.fail(),
          (a) => P.of(a)
        )
      )
    )
  );

type BitLength = 8 | 16 | 24 | 32 | 40 | 48;

export const int_le: (bitLength: BitLength) => BufferParser<number> = int(
  Buffer.prototype.readIntLE
);

export const uint_le: (bitLength: BitLength) => BufferParser<number> = int(
  Buffer.prototype.readUIntLE
);

export const int_be: (bitLength: BitLength) => BufferParser<number> = int(
  Buffer.prototype.readIntBE
);

export const uint_be: (bitLength: BitLength) => BufferParser<number> = int(
  Buffer.prototype.readUIntBE
);

export const int32_le: BufferParser<number> = int_le(32);
export const int16_le: BufferParser<number> = int_le(16);

export const int8_be: BufferParser<number> = int_be(8);

export const uint32_le: BufferParser<number> = uint_le(32);
export const uint16_le: BufferParser<number> = uint_le(16);
export const uint8_le: BufferParser<number> = int_le(8);

export const uint8_be: BufferParser<number> = uint_be(8);

export const float32_le: BufferParser<number> = pipe(
  take<number>(4),
  P.map((as) => Buffer.from(as)),
  P.map((buffer) => buffer.readFloatLE())
);

export const char: BufferParser<string> = pipe(
  int_le(8),
  P.map(String.fromCharCode)
);

export const str: (byteLength: number) => BufferParser<string> = (byteLength) =>
  flow(
    pipe(
      manyN(char, byteLength),
      P.map((a) => a.join(""))
    )
  );

export const ztstr: BufferParser<string> = pipe(
  P.takeUntil<number>((a) => a === 0),
  P.chainFirst(() => skip(1)),
  P.map((as) => String.fromCharCode(...as))
);

export const ztstr_padded: (minLength: number) => BufferParser<string> =
  (minLength) => (i) =>
    pipe(
      ztstr(i),
      E.chain((a) =>
        success(
          a.value,
          stream(a.next.buffer, a.start.cursor + minLength),
          a.start
        )
      )
    );
