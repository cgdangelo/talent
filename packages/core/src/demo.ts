import { either as E } from "fp-ts";
import { sequenceS } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";
import type { Directory } from "./directory";
import { directory } from "./directory";
import type { Header } from "./header";
import { header } from "./header";

export type Demo = {
  readonly header: Header;
  readonly directory: Directory;
};

export const demo = (buffer: Buffer): E.Either<Error, Demo> =>
  pipe(
    sequenceS(E.Applicative)({
      header: header(buffer),
      directory: directory(buffer),
    })
  );
