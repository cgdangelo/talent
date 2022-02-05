import { header } from "@talent/parser-goldsrc/lib/DemoHeader";
import { stream } from "@talent/parser/lib/Stream";
import { console, taskEither as TE } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import * as fs from "fs/promises";

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

const filenames = process.argv.slice(2);

const main = pipe(
  filenames,
  TE.traverseSeqArray((originalFilename) =>
    pipe(
      getNewDemoName(originalFilename),
      TE.map((filename) => `${originalFilename} -> ${filename}`),
      TE.chainIOK(console.log)
    )
  )
);

main().then(console.log).catch(console.error);
