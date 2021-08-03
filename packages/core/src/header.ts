import * as P from "@talent/parser";
import { either as E } from "fp-ts";
import { sequenceS } from "fp-ts/lib/Apply";
import { flow } from "fp-ts/lib/function";
import { toError } from "./utils";

export type Header = {
  readonly gameDirectory: string;
  readonly magic: "HLDEMO";
  readonly mapChecksum: number;
  readonly mapName: string;
  readonly networkProtocol: number;
  readonly protocol: 5;
};

const magic: P.Parser<Buffer, "HLDEMO"> = flow(
  P.str(8),
  E.fromPredicate(
    (a): a is "HLDEMO" => a === "HLDEMO",
    toError("unsupported magic")
  )
);

const protocol: P.Parser<Buffer, 5> = flow(
  P.int32_le,
  E.chain(
    E.fromPredicate((a): a is 5 => a === 5, toError("unsupported protocol"))
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
