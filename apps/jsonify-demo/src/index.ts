import { demo } from '@cgdangelo/talent-parser-goldsrc/lib/Demo';
import type { Stream } from '@cgdangelo/talent-parser/lib/Stream';
import { stream } from '@cgdangelo/talent-parser/lib/Stream';
import * as Console from 'fp-ts/lib/Console';
import * as E from 'fp-ts/lib/Either';
import { constant, flow, pipe } from 'fp-ts/lib/function';
import * as json from 'fp-ts/lib/Json';
import { not } from 'fp-ts/lib/Predicate';
import * as S from 'fp-ts/lib/string';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { readFile } from 'fs/promises';

const validateDemoPath: (path?: string) => E.Either<Error, string> = flow(
  E.fromNullable('no demo path provided'),
  E.chain(E.fromPredicate(not(S.isEmpty), constant('demo path is empty'))),
  E.bimap(E.toError, S.trim)
);

const bufferToStream: (buffer: Buffer) => Stream<number> = (buffer) => stream(buffer as unknown as number[]);

const readFileContents: (path: string) => TE.TaskEither<Error, Stream<number>> = (path) =>
  pipe(
    TE.tryCatch(() => readFile(path), E.toError),
    TE.map(bufferToStream)
  );

const main: T.Task<void> = pipe(
  TE.fromEither(validateDemoPath(process.argv[2])),
  TE.chain(readFileContents),
  TE.chainEitherKW(demo()),
  TE.map(({ value }) => value),
  TE.chainEitherK(json.stringify),
  TE.mapLeft((e) => (e instanceof Error ? e : E.toError(e))),
  TE.fold((e) => T.of(e.message), T.of),
  T.chainIOK(Console.log)
);

main().catch(() => {});
