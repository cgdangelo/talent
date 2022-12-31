import { header } from '@cgdangelo/talent-parser-goldsrc/lib/DemoHeader';
import type { Stream } from '@cgdangelo/talent-parser/lib/Stream';
import { stream } from '@cgdangelo/talent-parser/lib/Stream';
import * as Console from 'fp-ts/lib/Console';
import * as E from 'fp-ts/lib/Either';
import { constant, flow, pipe } from 'fp-ts/lib/function';
import { not } from 'fp-ts/lib/Predicate';
import * as S from 'fp-ts/lib/string';
import * as TE from 'fp-ts/lib/TaskEither';
import * as fs from 'fs/promises';
import * as path from 'path';

const validateDemoPath: (path?: string) => E.Either<Error, string> = flow(
  E.fromNullable('no demo path provided'),
  E.chain(E.fromPredicate(not(S.isEmpty), constant('demo path is empty'))),
  E.bimap(E.toError, S.trim)
);

const bufferToStream: (buffer: Buffer) => Stream<number> = (buffer) => stream(buffer as unknown as number[]);

const readFileContents: (path: string) => TE.TaskEither<Error, Stream<number>> = (path) =>
  pipe(
    TE.tryCatch(() => fs.readFile(path), E.toError),
    TE.map(bufferToStream)
  );

const fileCreationDate: (path: string) => TE.TaskEither<Error, Date> = (path) =>
  pipe(
    TE.tryCatch(() => fs.stat(path), E.toError),
    TE.map(({ mtime }) => mtime)
  );

const padNumber: (a: number) => string = (a) => a.toString().padStart(2, '0');

const getNewDemoName: (path: string) => TE.TaskEither<unknown, string> = (path) =>
  pipe(
    readFileContents(path),
    TE.chainEitherKW(
      flow(
        header,
        E.map(({ value: { mapName } }) => mapName)
      )
    ),
    TE.bindTo('mapName'),
    TE.bindW('creationDate', () => fileCreationDate(path)),
    TE.map(
      ({ creationDate, mapName }) =>
        `${creationDate.getFullYear()}-` +
        `${padNumber(creationDate.getMonth() + 1)}-` +
        `${padNumber(creationDate.getDate())}_` +
        `${padNumber(creationDate.getHours())}` +
        `${padNumber(creationDate.getMinutes())}_${mapName}.dem`
    )
  );

const renameFile: (originalFile: string) => (newFile: string) => TE.TaskEither<unknown, void> =
  (originalFile) => (newFile) =>
    TE.tryCatch(() => fs.rename(originalFile, newFile), E.toError);

const renameDemo: (path: string) => TE.TaskEither<unknown, void> = (originalFile) =>
  pipe(
    validateDemoPath(originalFile),
    TE.fromEither,
    TE.apSecond(getNewDemoName(originalFile)),
    TE.map((newFile) => path.resolve(path.dirname(originalFile), newFile)),
    TE.chainFirst(renameFile(originalFile)),
    TE.chainIOK((newFile) => Console.log(`Renamed ${originalFile} -> ${newFile}.\n`))
  );

const main: TE.TaskEither<unknown, unknown> = pipe(process.argv.slice(2), TE.traverseArray(renameDemo));

main()
  .then(() => {})
  .catch(() => {});
