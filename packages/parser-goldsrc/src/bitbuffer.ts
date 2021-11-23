import * as P from "@talent/parser/lib/Parser";
import { error, success } from "@talent/parser/lib/ParseResult";
import { stream } from "@talent/parser/lib/Stream";
import { pipe } from "fp-ts/lib/function";

export const bits: (n: number) => P.Parser<number, number> = (n) => (i) => {
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

  // TODO Handle signed

  return success(value >>> 0, i, stream(i.buffer, offset));
};

export const ztstr: P.Parser<number, string> = pipe(
  P.manyTill(
    bits(8),

    pipe(
      bits(8),
      P.filter((a) => a === 0x00)
    )
  ),

  P.map((as) => String.fromCharCode(...as))
);

export const nextByte: P.Parser<number, void> = (i) =>
  success(undefined, i, stream(i.buffer, (Math.floor(i.cursor / 8) + 1) * 8));
