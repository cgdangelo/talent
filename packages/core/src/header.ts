import { either as E } from "fp-ts";
import { sequenceS } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";
import { int32_le, str, toError, uint32_le } from "./utils";

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
    }),
    E.map((a) => ({
      ...a,
      networkProtocol: int32_le(buffer)(12),
      mapName: str(buffer)(13)(260),
      gameDirectory: str(buffer)(274)(260),
      mapChecksum: uint32_le(buffer)(535),
    }))
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
    E.fromPredicate((a): a is 5 => a === 5, toError("unsupported protocol"))
  );
