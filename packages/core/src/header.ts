import * as P from "@talent/parser";
import { sequenceS } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";
import { toError } from "./utils";

export type Header = {
  readonly gameDirectory: string;
  readonly magic: "HLDEMO";
  readonly mapChecksum: number;
  readonly mapName: string;
  readonly networkProtocol: number;
  readonly protocol: 5;
};

const magic: P.Parser<Buffer, "HLDEMO"> = pipe(
  P.str(8),
  P.chain((a) =>
    a === "HLDEMO" ? P.succeed(a) : P.fail(toError("unsupported magic")(a))
  )
);

const protocol: P.Parser<Buffer, 5> = pipe(
  P.int32_le,
  P.chain((a) =>
    a === 5 ? P.succeed(a) : P.fail(toError("unsupported protocol")(a))
  )
);

export const header: P.Parser<Buffer, Header> = sequenceS(P.Applicative)({
  magic,
  protocol,
  networkProtocol: P.int32_le,
  mapName: P.str(260),
  gameDirectory: P.str(260),
  mapChecksum: P.uint32_le,
});
