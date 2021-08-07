import { demo } from "@talent/parser-goldsrc/lib/demo";
import type { Stream } from "@talent/parser/lib/Stream";
import { either as E, string as S, taskEither as TE } from "fp-ts";
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
    TE.map((buffer) => ({ buffer, cursor: 0 }))
  );

const validateDemoPath: (path?: string) => E.Either<string, string> = flow(
  E.fromNullable("no demo path provided"),
  E.map((s) => s.trim()),
  E.chain(
    E.fromPredicate(
      flow(S.size, (a) => a !== 0),
      constant("demo path is empty")
    )
  )
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
