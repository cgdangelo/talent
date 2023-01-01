import * as P from '@cgdangelo/talent-parser/lib/Parser';
import { success } from '@cgdangelo/talent-parser/lib/ParseResult';
import { stream } from '@cgdangelo/talent-parser/lib/Stream';
import { either as E } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

export type BufferParser<A> = P.Parser<number, A>;

const makeIntParser: (
  fa: Buffer[`read${'U' | ''}Int${'L' | 'B'}E`]
) => (bitLength: BitLength) => BufferParser<number> = (fa) => (bitLength) =>
  pipe(
    P.take<number>(bitLength / 8),
    P.chain((buffer) =>
      pipe(
        E.tryCatch(() => fa.call(buffer, 0, buffer.length), E.toError),
        E.match(
          () => P.fail(),
          (a) => P.succeed(a)
        )
      )
    )
  );

type BitLength = 8 | 16 | 24 | 32 | 40 | 48;

export const int_le: (bitLength: BitLength) => BufferParser<number> = makeIntParser(
  Buffer.prototype.readIntLE
);

export const uint_le: (bitLength: BitLength) => BufferParser<number> = makeIntParser(
  Buffer.prototype.readUIntLE
);

export const int_be: (bitLength: BitLength) => BufferParser<number> = makeIntParser(
  Buffer.prototype.readIntBE
);

export const uint_be: (bitLength: BitLength) => BufferParser<number> = makeIntParser(
  Buffer.prototype.readUIntBE
);

export const int32_le: BufferParser<number> = int_le(32);
export const uint32_le: BufferParser<number> = uint_le(32);

export const int16_le: BufferParser<number> = int_le(16);
export const uint16_le: BufferParser<number> = uint_le(16);

export const int8_le: BufferParser<number> = int_le(8);
export const uint8_le: BufferParser<number> = uint_le(8);

export const float32_le: BufferParser<number> = pipe(
  P.take<number>(4),
  P.map((as) => Buffer.from(as)),
  P.map((buffer) => buffer.readFloatLE())
);

export const char: BufferParser<string> = pipe(int_le(8), P.map(String.fromCharCode));

export const str: (byteLength: number) => BufferParser<string> = (byteLength) =>
  pipe(
    P.manyN(char, byteLength),
    P.map((a) => a.join(''))
  );

export const ztstr: BufferParser<string> = pipe(
  P.takeUntil<number>((a) => a === 0),
  P.apFirst(P.skip(1)),
  P.map((as) => String.fromCharCode(...as))
);

export const ztstr_padded: (minLength: number) => BufferParser<string> = (minLength) => (i) =>
  pipe(
    ztstr(i),
    E.chain((a) => success(a.value, a.start, stream(a.next.buffer, a.start.cursor + minLength)))
  );
