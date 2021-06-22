import { array as A, either as E, option as O, taskEither as TE } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import { readFile } from "fs/promises";
import { resolve } from "path";
import { readHeader } from "./header";

const DEMO_PATH = resolve(__dirname, "../../../demo.dem");

export const readString = (buffer: Buffer, cursor = 0, length = 1): string =>
  pipe(
    A.range(1, length),
    A.filterMapWithIndex((i) =>
      pipe(
        String.fromCharCode(buffer.readInt8(cursor + i)),
        O.fromPredicate((a) => a !== "\x00")
      )
    ),
    (a) => a.join("") // HACK I'm sure there's a better way to do this.
  );

const readFileContents = (path: string): TE.TaskEither<Error, Buffer> =>
  TE.tryCatch(() => readFile(path), E.toError);

pipe(
  readFileContents(DEMO_PATH),
  TE.map(readHeader),
  TE.bimap(console.error, (a) => console.dir(a, { depth: Infinity }))
)();
