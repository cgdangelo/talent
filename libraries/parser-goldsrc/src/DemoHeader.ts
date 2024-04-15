import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import * as P from '@cgdangelo/talent-parser/lib/Parser';
import { pipe } from 'fp-ts/lib/function';

export type DemoHeader = {
  readonly magic: 'HLDEMO';
  readonly demoProtocol: 5;
  readonly networkProtocol: number;
  readonly mapName: string;
  readonly gameDirectory: string;
  readonly mapChecksum: number;
};

const magic: B.BufferParser<'HLDEMO'> = P.expected(
  pipe(
    B.ztstr_padded(8),
    P.filter((a): a is 'HLDEMO' => a === 'HLDEMO')
  ),
  "magic 'HLDEMO'"
);

export const demoProtocol: B.BufferParser<5> = P.expected(
  pipe(
    B.uint32_le,
    P.filter((a): a is 5 => a === 5)
  ),
  'demo protocol 5'
);

export const header: B.BufferParser<DemoHeader> = P.struct({
  magic,
  demoProtocol,
  networkProtocol: B.uint32_le,
  mapName: B.ztstr_padded(260),
  gameDirectory: B.ztstr_padded(260),
  mapChecksum: B.int32_le
});
