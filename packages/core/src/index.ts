import { either as E, string as S, taskEither as TE } from "fp-ts";
import { constant, flow, pipe } from "fp-ts/lib/function";
import { readFile } from "fs/promises";
import { demo } from "./demo";
import { eq, not } from "./utils";

const readFileContents = (path: string): TE.TaskEither<Error, Buffer> =>
  TE.tryCatch(() => readFile(path), E.toError);

const validateDemoPath = (path?: string): E.Either<Error, string> =>
  pipe(
    path,
    E.fromNullable(new Error("no demo path provided")),
    E.map((s) => s.trim()),
    E.chain(
      E.fromPredicate(
        flow(S.size, eq(0), not),
        constant(new Error("demo path is empty"))
      )
    )
  );

const main = pipe(
  validateDemoPath(process.argv[2]),
  TE.fromEither,
  TE.chain(readFileContents),
  TE.chainEitherK(demo)
);

main().then(console.log).catch(console.error);
