import { either as E } from "fp-ts";
import { sequenceS } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";
import type { Directory } from "./directory";
import { readDirectory } from "./directory";
import type { Header } from "./header";
import { readHeader } from "./header";

export type Demo = {
  readonly header: Header;
  readonly directory: Directory;
};

export const readDemo = (buffer: Buffer): E.Either<Error, Demo> =>
  pipe(
    sequenceS(E.Applicative)({
      header: readHeader(buffer),
      directory: readDirectory(buffer),
    })
  );
