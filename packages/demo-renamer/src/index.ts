import { header } from "@talent/parser-goldsrc/lib/DemoHeader";
import { stream } from "@talent/parser/lib/Stream";
import type { task as T } from "fp-ts";
import { console, taskEither as TE } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import * as fs from "fs/promises";
import * as path from "path";
import * as readline from "readline";

const getNewDemoName = (path: string) =>
  pipe(
    TE.fromTask(() => fs.readFile(path)),
    TE.chainEitherKW((buffer) =>
      pipe(stream(buffer as unknown as number[]), header)
    ),
    TE.map(({ value: { mapName } }) => mapName),
    TE.bindTo("mapName"),
    TE.bind("creationDate", () =>
      pipe(
        TE.fromTask(() => fs.stat(path)),
        TE.map(({ birthtime }) => birthtime)
      )
    ),
    TE.map(
      ({ creationDate, mapName }) =>
        `${creationDate.getFullYear()}-${(creationDate.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${creationDate
          .getDate()
          .toString()
          .padStart(2, "0")}_${creationDate
          .getHours()
          .toString()
          .padStart(2, "0")}${creationDate
          .getMinutes()
          .toString()
          .padStart(2, "0")}_${mapName}.dem`
    )
  );

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question: (query: string) => T.Task<string> = (query) => () =>
  new Promise((resolve) => rl.question(query, resolve));

const renameFile: (originalFile: string) => (newFile: string) => T.Task<void> =
  (originalFile) => (newFile) => () =>
    fs.rename(originalFile, newFile);

const main = pipe(
  process.argv.slice(2),

  TE.traverseSeqArray((originalFile) =>
    pipe(
      TE.fromTask(() => fs.access(originalFile)),
      TE.apSecond(getNewDemoName(originalFile)),
      TE.map((newFile) => path.resolve(path.dirname(originalFile), newFile)),
      TE.chainFirst((newFile) =>
        pipe(
          question(`Rename ${originalFile} -> ${newFile}? [Y/n]: `),
          TE.fromTask,
          TE.chainW(
            TE.fromPredicate(
              (answer) => answer.trim().toLowerCase() === "y",
              () => ""
            )
          )
        )
      ),
      TE.chainFirstTaskK(renameFile(originalFile)),
      TE.chainFirstIOK((newFile) =>
        console.log(`Renamed ${originalFile} -> ${newFile}.`)
      )
    )
  )
);

main()
  .catch((e) => console.error(e)())
  .finally(() => rl.close());
