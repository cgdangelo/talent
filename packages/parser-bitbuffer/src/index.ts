import * as P from "@talent/parser/lib/Parser";
import { error, success } from "@talent/parser/lib/ParseResult";
import { stream } from "@talent/parser/lib/Stream";
import { pipe } from "fp-ts/lib/function";

const bits_: (signed: boolean) => (n: number) => P.Parser<number, number> =
  (signed) => (n) => (i) => {
    let offset = i.cursor;

    const available = i.buffer.length * 8 - offset;

    if (n > available) return error(i);

    let value = 0;

    for (let bitIndex = 0; bitIndex < n; ) {
      const remaining = n - bitIndex;
      const bitOffset = offset & 7;
      const currentByte = i.buffer[offset >> 3];

      if (currentByte == null) return error(i);

      const read = Math.min(remaining, 8 - bitOffset);

      const mask = (1 << read) - 1;

      const readBits = (currentByte >> bitOffset) & mask;

      value |= readBits << bitIndex;

      offset += read;
      bitIndex += read;
    }

    if (signed && n !== 32 && value & (1 << (n - 1))) {
      value |= -1 ^ ((1 << n) - 1);
    }

    return success(signed ? value : value >>> 0, i, stream(i.buffer, offset));
  };

export const bits: (n: number) => P.Parser<number, number> = bits_(true);

export const ubits: (n: number) => P.Parser<number, number> = bits_(false);

export const ztstr: P.Parser<number, string> = pipe(
  P.manyTill(
    ubits(8),

    pipe(
      ubits(8),
      P.filter((a) => a === 0)
    )
  ),

  P.map((as) => String.fromCharCode(...as))
);

export const nextByte: <I, A>(fa: P.Parser<I, A>) => P.Parser<I, A> = (fa) =>
  pipe(
    P.withStart(fa),
    P.chain(
      ([a, i]) =>
        (o) =>
          success(
            a,
            i,
            stream(
              o.buffer,
              o.cursor % 8 === 0 ? o.cursor / 8 : Math.floor(o.cursor / 8) + 1
            )
          )
    )
  );
