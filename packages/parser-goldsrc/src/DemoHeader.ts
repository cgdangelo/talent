import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { sequenceS } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";

export type DemoHeader = {
  readonly magic: "HLDEMO";
  readonly demoProtocol: 5;
  readonly networkProtocol: number;
  readonly mapName: string;
  readonly gameDirectory: string;
  readonly mapChecksum: number;
};

const magic: B.BufferParser<"HLDEMO"> = P.expected(
  pipe(
    B.ztstr_padded(8),
    P.filter((a): a is "HLDEMO" => a === "HLDEMO")
  ),
  "'HLDEMO' magic value"
);

export const demoProtocol: B.BufferParser<5> = P.expected(
  pipe(
    B.int32_le,
    P.filter((a): a is 5 => a === 5)
  ),
  "5"
);

export const header: B.BufferParser<DemoHeader> = sequenceS(P.Applicative)({
  magic,
  demoProtocol,
  networkProtocol: B.int32_le,
  mapName: B.ztstr_padded(260),
  gameDirectory: B.ztstr_padded(260),
  mapChecksum: B.uint32_le,
});
