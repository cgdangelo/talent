import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { sequenceS } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";

export type Header = {
  readonly gameDirectory: string;
  readonly magic: "HLDEMO";
  readonly mapChecksum: number;
  readonly mapName: string;
  readonly networkProtocol: number;
  readonly protocol: 5;
};

const magic: B.BufferParser<"HLDEMO"> = pipe(
  B.str(8),
  P.chain((a) =>
    a === "HLDEMO\x00\x00"
      ? P.succeed("HLDEMO")
      : P.fail(`unsupported magic: ${a}`)
  )
);

const protocol: B.BufferParser<5> = pipe(
  B.int32_le,
  P.chain((a) =>
    a === 5 ? P.succeed(a) : P.fail(`unsupported protocol: ${a}`)
  )
);

export const header: B.BufferParser<Header> = sequenceS(P.Applicative)({
  magic,
  protocol,
  networkProtocol: B.int32_le,
  mapName: B.str(260),
  gameDirectory: B.str(260),
  mapChecksum: B.uint32_le,
});
