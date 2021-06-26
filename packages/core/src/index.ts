import { either as E, taskEither as TE } from "fp-ts";
import { error } from "fp-ts/lib/Console";
import { pipe } from "fp-ts/lib/function";
import { readFile } from "fs/promises";
import { demo } from "./demo";
import { dumpObject } from "./utils";

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

const main = pipe(
  validateDemoPath(process.argv[2]),
  TE.fromEither,
  TE.chain(readFileContents),
  TE.chainEitherK(demo),
  TE.bimap(error, dumpObject)
);

main();
