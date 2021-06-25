import {
  array as A,
  either as E,
  io,
  option as O,
  taskEither as TE,
} from "fp-ts";
import { error } from "fp-ts/lib/Console";
import { pipe } from "fp-ts/lib/function";
import { readFile } from "fs/promises";
import type { InspectOptions } from "util";
import { readDemo } from "./demo";

const dir =
  (options: InspectOptions) =>
  (obj: unknown): io.IO<void> =>
    io.of(console.dir(obj, options));

export const dumpObject = dir({ depth: Infinity });

export const readString =
  (buffer: Buffer) =>
  (cursor = 0) =>
  (length = 1): string =>
    pipe(
      A.range(1, length),
      A.filterMapWithIndex((i) =>
        pipe(
          String.fromCharCode(buffer.readInt8(cursor + i)),
          O.fromPredicate((a) => a !== "\x00")
        )
      ),
      (a) => a.join("")
    );

const readFileContents = (path: string): TE.TaskEither<Error, Buffer> =>
  TE.tryCatch(() => readFile(path), E.toError);

const validateDemoPath = (path?: string): E.Either<Error, string> =>
  pipe(
    path,
    E.fromNullable(new Error("no demo path provided")),
    E.map((s) => s.trim()),
    E.chain(
      E.fromPredicate(
        (s) => s.length !== 0,
        () => new Error("demo path is empty")
      )
    )
  );

pipe(
  validateDemoPath(process.argv[2]),
  TE.fromEither,
  TE.chain(readFileContents),
  TE.chainEitherK(readDemo),
  TE.bimap(error, dumpObject)
)();
