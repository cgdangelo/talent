import { either as E } from "fp-ts";
import { sequenceS } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";
import { int32_le, str, uint32_le } from "./parser";
import { toError } from "./utils";

export type Header = {
  readonly gameDirectory: string;
  readonly magic: "HLDEMO";
  readonly mapChecksum: number;
  readonly mapName: string;
  readonly networkProtocol: number;
  readonly protocol: 5;
};

export const header = (buffer: Buffer): E.Either<Error, Header> =>
  pipe(
    sequenceS(E.Applicative)({
      magic: magic(buffer),
      protocol: protocol(buffer),
      networkProtocol: int32_le(buffer)(12),
      mapName: E.of(str(buffer)(16)(260)),
      gameDirectory: E.of(str(buffer)(276)(260)),
      mapChecksum: uint32_le(buffer)(536),
    })
  );

const magic = (buffer: Buffer): E.Either<Error, "HLDEMO"> =>
  pipe(
    str(buffer)()(8),
    E.fromPredicate(
      (a): a is "HLDEMO" => a === "HLDEMO",
      toError("unsupported magic")
    )
  );

const protocol = (buffer: Buffer): E.Either<Error, 5> =>
  pipe(
    int32_le(buffer)(8),
    E.chain(
      E.fromPredicate((a): a is 5 => a === 5, toError("unsupported protocol"))
    )
  );
