import * as P from '@cgdangelo/talent-parser/lib/Parser';
import { success } from '@cgdangelo/talent-parser/lib/ParseResult';
import { stream } from '@cgdangelo/talent-parser/lib/Stream';
import { pipe } from 'fp-ts/lib/function';
import * as B from '../buffer';

// HACK
const b: (buffer: Buffer) => number[] = (b) => b as unknown as number[];

describe('buffer', () => {
  test.each([
    [8, -1],
    [16, -257],
    [24, -131329],
    [32, -50462977],
    [40, -17230332161],
    [48, -5514788471041]
  ] as const)('int_le %d', (bitLength, expected) => {
    const buffer = Buffer.of(-1, -2, -3, -4, -5, -6);

    expect(pipe(stream(b(buffer)), B.int_le(bitLength))).toStrictEqual(
      success(expected, stream(b(buffer)), stream(b(buffer), bitLength / 8))
    );
  });

  test.each([
    [8, 1],
    [16, 513],
    [24, 197121],
    [32, 67305985],
    [40, 21542142465],
    [48, 6618611909121]
  ] as const)('uint_le %d', (bitLength, expected) => {
    const buffer = Buffer.of(1, 2, 3, 4, 5, 6);

    expect(pipe(stream(b(buffer)), B.uint_le(bitLength))).toStrictEqual(
      success(expected, stream(b(buffer)), stream(b(buffer), bitLength / 8))
    );
  });

  test.each([
    [8, -1],
    [16, -2],
    [24, -259],
    [32, -66052],
    [40, -16909061],
    [48, -4328719366]
  ] as const)('int_be %d', (bitLength, expected) => {
    const buffer = Buffer.of(-1, -2, -3, -4, -5, -6);

    expect(pipe(stream(b(buffer)), B.int_be(bitLength))).toStrictEqual(
      success(expected, stream(b(buffer)), stream(b(buffer), bitLength / 8))
    );
  });

  test.each([
    [8, 1],
    [16, 258],
    [24, 66051],
    [32, 16909060],
    [40, 4328719365],
    [48, 1108152157446]
  ] as const)('uint_be %d', (bitLength, expected) => {
    const buffer = Buffer.of(1, 2, 3, 4, 5, 6);

    expect(pipe(stream(b(buffer)), B.uint_be(bitLength))).toStrictEqual(
      success(expected, stream(b(buffer)), stream(b(buffer), bitLength / 8))
    );
  });

  test('char', () => {
    const buffer = Buffer.from('foo');

    expect(pipe(stream(b(buffer)), B.char)).toStrictEqual(
      success('f', stream(b(buffer)), stream(b(buffer), 1))
    );

    expect(pipe(stream(b(buffer), 1), B.char)).toStrictEqual(
      success('o', stream(b(buffer), 1), stream(b(buffer), 2))
    );

    expect(pipe(stream(b(buffer), 2), B.char)).toStrictEqual(
      success('o', stream(b(buffer), 2), stream(b(buffer), 3))
    );
  });

  test('str', () => {
    const buffer = Buffer.from('foo');

    expect(pipe(stream(b(buffer)), B.str(1))).toStrictEqual(
      success('f', stream(b(buffer)), stream(b(buffer), 1))
    );

    expect(pipe(stream(b(buffer)), B.str(3))).toStrictEqual(
      success('foo', stream(b(buffer)), stream(b(buffer), 3))
    );

    const longerBuffer = Buffer.from('foo bar baz');

    expect(pipe(stream(b(longerBuffer), 4), B.str(3))).toStrictEqual(
      success('bar', stream(b(longerBuffer), 4), stream(b(longerBuffer), 7))
    );
  });

  test('float32_le', () => {
    const buffer = Buffer.of(1, 2, 3, 4);

    expect(pipe(stream(b(buffer)), B.float32_le)).toStrictEqual(
      success(1.539989614439558e-36, stream(b(buffer)), stream(b(buffer), 4))
    );
  });

  test('take', () => {
    const buffer = Buffer.alloc(100);

    expect(pipe(stream(b(buffer)), P.take(50))).toStrictEqual(
      success(Buffer.alloc(50), stream(b(buffer)), stream(b(buffer), 50))
    );
  });
});
