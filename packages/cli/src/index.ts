import { demo } from "@talent/parser-goldsrc/lib/Demo";
import type { Stream } from "@talent/parser/lib/Stream";
import { stream } from "@talent/parser/lib/Stream";
import * as console from "fp-ts/lib/Console";
import * as E from "fp-ts/lib/Either";
import { constant, flow, pipe } from "fp-ts/lib/function";
import * as json from "fp-ts/lib/Json";
import { not } from "fp-ts/lib/Predicate";
import * as S from "fp-ts/lib/string";
import * as TE from "fp-ts/lib/TaskEither";
import { readFile } from "fs/promises";

const validateDemoPath: (path?: string) => E.Either<Error, string> = flow(
  E.fromNullable("no demo path provided"),
  E.chain(E.fromPredicate(not(S.isEmpty), constant("demo path is empty"))),
  E.bimap(E.toError, S.trim)
);

const bufferToStream: (buffer: Buffer) => Stream<number> = (buffer) =>
  stream(buffer as unknown as number[]);

const readFileContents: (path: string) => TE.TaskEither<Error, Stream<number>> =
  (path) =>
    pipe(
      TE.tryCatch(() => readFile(path), E.toError),
      TE.map(bufferToStream)
    );

const parseDemo = flow(
  demo,
  E.bimap(
    ({ expected }) => E.toError(expected),
    ({ value }) => value
  )
);

const serializeDemo = flow(json.stringify, E.mapLeft(E.toError));

const main = pipe(
  validateDemoPath(process.argv[2]),
  TE.fromEither,
  TE.chain(readFileContents),
  TE.chainEitherKW(parseDemo),
  TE.chainEitherK(serializeDemo),
  TE.chainIOK(console.log)
);

main();
