import { array as A, either as E, option as O, taskEither as TE } from "fp-ts";
import { sequenceS } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";
import { readFile } from "fs/promises";
import { resolve } from "path";

const DEMO_PATH = resolve(__dirname, "../../../demo.dem");

const DIRECTORY_ENTRY_LENGTH =
  4 + // Unknown
  64 + // Title
  8 + // "flags, cdtrack" ?
  12; // "frames, offset and length"

type Header = {
  readonly gameDirectory: string;
  readonly magic: "HLDEMO";
  readonly mapChecksum: number;
  readonly mapName: string;
  readonly networkProtocol: number;
  readonly protocol: 5;
};

type DirectoryEntry = {
  readonly index: number;
  readonly title: string;
  readonly time: number;
};

const readString = (buffer: Buffer, cursor = 0, length = 1): string =>
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

const readMagic = (buffer: Buffer): E.Either<Error, "HLDEMO"> =>
  pipe(
    readString(buffer, 0, 8),
    E.fromPredicate(
      (a): a is "HLDEMO" => a === "HLDEMO",
      (a) => new Error(`unsupported magic: ${a}`)
    )
  );

const readProtocol = (buffer: Buffer): E.Either<Error, 5> =>
  pipe(
    buffer.readInt32LE(8),
    E.fromPredicate(
      (a): a is 5 => a === 5,
      (a) => new Error(`unsupported protocol: ${a}`)
    )
  );

const readDirectoryEntriesOffset = (buffer: Buffer): E.Either<Error, number> =>
  pipe(
    buffer.readUInt32LE(540),
    E.fromPredicate(
      (a) => a === buffer.byteLength - 4 - 92 * 2,
      (a) => new Error(`directory entries offset did not match expected: ${a}`)
    )
  );

const readTotalDirectoryEntries =
  (buffer: Buffer) =>
  (directoryEntriesOffset: number): E.Either<Error, number> =>
    pipe(
      buffer.readInt32LE(directoryEntriesOffset),
      E.fromPredicate(
        (a) => a === 2,
        (a) => new Error(`unexpected number of directory entries: ${a}`)
      )
    );

const readDirectoryEntry = (buffer: Buffer, cursor = 0): DirectoryEntry => ({
  index: buffer.readInt32LE(cursor),
  title: readString(buffer, cursor + 4, 64),
  time: buffer.readFloatLE(cursor + 4 + 64 + 4 + 4),
});

const readDirectoryEntries = (
  buffer: Buffer
): E.Either<Error, readonly DirectoryEntry[]> =>
  pipe(
    readDirectoryEntriesOffset(buffer),
    E.chainFirst(readTotalDirectoryEntries(buffer)),
    E.map((directoryEntriesOffset) => [
      readDirectoryEntry(buffer, directoryEntriesOffset),
      readDirectoryEntry(
        buffer,
        directoryEntriesOffset + DIRECTORY_ENTRY_LENGTH + 1
      ),
    ])
  );

const readHeader = (buffer: Buffer): E.Either<Error, Header> =>
  pipe(
    sequenceS(E.Applicative)({
      magic: readMagic(buffer),
      protocol: readProtocol(buffer),
      directoryEntries: readDirectoryEntries(buffer),
    }),
    E.map((a) => ({
      ...a,
      networkProtocol: buffer.readInt32LE(12),
      mapName: readString(buffer, 13, 260),
      gameDirectory: readString(buffer, 274, 260),
      mapChecksum: buffer.readUInt32LE(535),
    }))
  );

pipe(
  readFileContents(DEMO_PATH),
  TE.map(readHeader),
  TE.bimap(console.error, console.log)
)();
