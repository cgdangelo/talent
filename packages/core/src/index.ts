import { array as A, either as E, option as O, taskEither as TE } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import { readFile } from "fs/promises";
import { readDemo } from "./demo";

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

const getDemoPath = (path?: string): E.Either<Error, string> =>
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
  process.argv[2],
  getDemoPath,
  TE.fromEither,
  TE.chain(readFileContents),
  TE.chainEitherK(readDemo),
  TE.bimap(console.error, (a) => console.dir(a, { depth: Infinity }))
)();
