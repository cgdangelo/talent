import { either as E } from "fp-ts";
import { sequenceS } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";
import { readString } from ".";
import type { Directory } from "./directory";
import { readDirectory } from "./directory";

export type Header = {
  readonly directory: Directory;
  readonly gameDirectory: string;
  readonly magic: "HLDEMO";
  readonly mapChecksum: number;
  readonly mapName: string;
  readonly networkProtocol: number;
  readonly protocol: 5;
};

export const readMagic = (buffer: Buffer): E.Either<Error, "HLDEMO"> =>
  pipe(
    readString(buffer, 0, 8),
    E.fromPredicate(
      (a): a is "HLDEMO" => a === "HLDEMO",
      (a) => new Error(`unsupported magic: ${a}`)
    )
  );

export const readProtocol = (buffer: Buffer): E.Either<Error, 5> =>
  pipe(
    buffer.readInt32LE(8),
    E.fromPredicate(
      (a): a is 5 => a === 5,
      (a) => new Error(`unsupported protocol: ${a}`)
    )
  );

export const readHeader = (buffer: Buffer): E.Either<Error, Header> =>
  pipe(
    sequenceS(E.Applicative)({
      magic: readMagic(buffer),
      protocol: readProtocol(buffer),
      directory: readDirectory(buffer),
    }),
    E.map((a) => ({
      ...a,
      networkProtocol: buffer.readInt32LE(12),
      mapName: readString(buffer, 13, 260),
      gameDirectory: readString(buffer, 274, 260),
      mapChecksum: buffer.readUInt32LE(535),
    }))
  );
