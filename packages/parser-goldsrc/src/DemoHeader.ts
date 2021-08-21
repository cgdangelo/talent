import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
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

const magic: B.BufferParser<"HLDEMO"> = pipe(
  P.sat(
    B.ztstr_padded(8),
    (a): a is "HLDEMO" => a === "HLDEMO",
    (a) => `unsupported magic: got ${a}, wanted HLDEMO`
  )
);

const demoProtocol: B.BufferParser<5> = P.sat(
  B.int32_le,
  (a): a is 5 => a === 5,
  (a) => `unsupported protocol: got ${a}, wanted 5`
);

export const header: B.BufferParser<DemoHeader> = sequenceS(P.Applicative)({
  magic,
  demoProtocol,
  networkProtocol: B.int32_le,
  mapName: B.ztstr_padded(260),
  gameDirectory: B.ztstr_padded(260),
  mapChecksum: B.uint32_le,
});
