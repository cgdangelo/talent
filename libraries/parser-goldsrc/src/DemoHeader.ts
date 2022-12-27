import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";
import { fst } from "fp-ts/lib/ReadonlyTuple";

export type DemoHeader = {
  readonly magic: "HLDEMO";
  readonly demoProtocol: 5;
  readonly networkProtocol: number;
  readonly mapName: string;
  readonly gameDirectory: string;
  readonly mapChecksum: number;
  readonly directoryOffset: number;
};

const magic: B.BufferParser<"HLDEMO"> = P.expected(
  pipe(
    B.ztstr_padded(8),
    P.filter((a): a is "HLDEMO" => a === "HLDEMO")
  ),
  "magic 'HLDEMO'"
);

export const demoProtocol: B.BufferParser<5> = P.expected(
  pipe(
    B.uint32_le,
    P.filter((a): a is 5 => a === 5)
  ),
  "demo protocol 5"
);

const directoryOffset: B.BufferParser<number> = pipe(
  P.withStart(B.uint32_le),
  P.filter(([a, i]) => a === i.buffer.length - 188),
  P.map(fst)
);

export const header: B.BufferParser<DemoHeader> = P.struct({
  magic,
  demoProtocol,
  networkProtocol: B.uint32_le,
  mapName: B.ztstr_padded(260),
  gameDirectory: B.ztstr_padded(260),
  mapChecksum: B.int32_le,
  directoryOffset,
});
