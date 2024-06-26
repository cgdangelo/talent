import { demo } from '@cgdangelo/talent-parser-goldsrc/lib/Demo';
import { type Stream, stream } from '@cgdangelo/talent-parser/lib/Stream';
import * as E from 'fp-ts/lib/Either';
import { apply, constant, flow, pipe } from 'fp-ts/lib/function';
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

/**
 * Get a TaskEither that contains a JSON serialization of a demo file, or a parse error.
 *
 * @param filePath - Path to the demo file.
 * @returns
 */
export function jsonifyDemoTaskEither(filePath: string): TE.TaskEither<Error, string> {
  return pipe(
    validateDemoPath(filePath),
    TE.fromEither,
    TE.chain(readFileContents),
    TE.chainEitherKW(demo()),
    TE.map(({ value }) => value),
    TE.chainEitherK(json.stringify),
    TE.mapLeft((e) => (e instanceof Error ? e : E.toError(e)))
  );
}

/**
 * Get a JSON serialization of a demo file.
 *
 * @param filePath - Path to the demo file.
 * @returns Promise containing JSON string serialization of the demo.
 */
export function jsonifyDemo(filePath: string): Promise<string> {
  const runJsonifyDemo = flow(
    jsonifyDemoTaskEither,
    TE.fold((e) => T.of(e.message), T.of),
    apply(undefined)
  );

  return runJsonifyDemo(filePath);
}
