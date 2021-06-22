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
  readonly directory: Directory;
  readonly gameDirectory: string;
  readonly magic: "HLDEMO";
  readonly mapChecksum: number;
  readonly mapName: string;
  readonly networkProtocol: number;
  readonly protocol: 5;
};

type Directory = {
  readonly entries: readonly DirectoryEntry[];
};

type DirectoryEntry = {
  readonly cdTrack: number;
  readonly description: string;
  readonly fileLength: number;
  readonly flags: number;
  readonly frameCount: number;
  readonly offset: number;
  readonly trackTime: number;
  readonly type: number;
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

const readDirectoryEntry = (buffer: Buffer, cursor = 0): DirectoryEntry => ({
  type: buffer.readInt32LE(cursor),
  description: readString(buffer, cursor + 4, 64),
  flags: 0,
  cdTrack: 0,
  trackTime: 0,
  frameCount: 0,
  offset: 0,
  fileLength: 0,
});

const readDirectoryEntries = (
  buffer: Buffer,
  directoryOffset: number
): readonly DirectoryEntry[] => [
  readDirectoryEntry(buffer, directoryOffset),
  readDirectoryEntry(buffer, directoryOffset + DIRECTORY_ENTRY_LENGTH + 8),
];

const readTotalDirectoryEntries =
  (buffer: Buffer) =>
  (directoryOffset: number): E.Either<Error, number> =>
    pipe(
      buffer.readInt32LE(directoryOffset),
      E.fromPredicate(
        (a) => a === 2,
        (a) => new Error(`unexpected number of directory entries: ${a}`)
      )
    );

const readDirectoryOffset = (buffer: Buffer): E.Either<Error, number> =>
  pipe(
    buffer.readUInt32LE(540),
    E.fromPredicate(
      (a) => a === buffer.byteLength - 4 - 92 * 2,
      (a) => new Error(`directory entries offset did not match expected: ${a}`)
    )
  );

const readDirectory = (buffer: Buffer): E.Either<Error, Directory> =>
  pipe(
    readDirectoryOffset(buffer),
    E.chainFirst(readTotalDirectoryEntries(buffer)),
    E.map((directoryOffset) => readDirectoryEntries(buffer, directoryOffset)),
    E.map((entries) => ({ entries }))
  );

const readHeader = (buffer: Buffer): E.Either<Error, Header> =>
  pipe(
    sequenceS(E.Applicative)({
      magic: readMagic(buffer),
      protocol: readProtocol(buffer),
      directory: readDirectory(buffer),
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
  TE.bimap(console.error, (a) => console.dir(a, { depth: Infinity }))
)();
