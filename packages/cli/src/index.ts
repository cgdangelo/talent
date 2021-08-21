import { demo } from "@talent/parser-goldsrc/lib/Demo";
import type { Stream } from "@talent/parser/lib/Stream";
import { stream } from "@talent/parser/lib/Stream";
import {
  either as E,
  predicate as P,
  string as S,
  taskEither as TE,
} from "fp-ts";
import { constant, flow, pipe } from "fp-ts/lib/function";
import { readFile } from "fs/promises";

const readFileContents: (
  path: string
) => TE.TaskEither<string, Stream<Buffer>> = (path) =>
  pipe(
    TE.tryCatch(
      () => readFile(path),
      flow(E.toError, (a) => a.message)
    ),
    TE.map(stream)
  );

const validateDemoPath: (path?: string) => E.Either<string, string> = flow(
  E.fromNullable("no demo path provided"),
  E.map(S.trim),
  E.chain(E.fromPredicate(P.not(S.isEmpty), constant("demo path is empty")))
);

const main = pipe(
  validateDemoPath(process.argv[2]),
  TE.fromEither,
  TE.chain(readFileContents),
  TE.chainEitherK(demo)
);

main()
  .then((a) => console.dir(a, { depth: Infinity }))
  .catch(console.error);
