import { either as E, taskEither as TE } from "fp-ts";
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
  gameDirectory: string;
  magic: "HLDEMO";
  mapChecksum: number;
  mapName: string;
  networkProtocol: number;
  protocol: 5;
};

type DirectoryEntry = {
  index: number;
  title: string;
  time: number;
};

const readString = (buffer: Buffer, cursor = 0, length = 1): string =>
  new Array(length)
    .fill(null)
    .map((_, i) => String.fromCharCode(buffer.readInt8(cursor + i)))
    .filter((s) => s !== "\x00")
    .join("");

const readDirectoryEntry = (buffer: Buffer, cursor = 0): DirectoryEntry => ({
  index: buffer.readInt32LE(cursor),
  title: readString(buffer, cursor + 4, 64),
  time: buffer.readFloatLE(cursor + 4 + 64 + 4 + 4),
});

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

const readDirectoryEntries = (
  buffer: Buffer
): E.Either<Error, DirectoryEntry[]> =>
  pipe(
    buffer.readUInt32LE(540),
    E.fromPredicate(
      (a) => a === buffer.byteLength - 4 - 92 * 2,
      (a) => new Error(`directory entries offset did not match expected: ${a}`)
    ),
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
  TE.Do,
  TE.bind("buffer", () => readFileContents(DEMO_PATH)),
  TE.bind("header", ({ buffer }) => TE.fromEither(readHeader(buffer))),
  TE.bimap(console.error, ({ buffer, header }) => {
    // Validate directory entries offset
    const directoryEntriesOffset = buffer.readUInt32LE(540);
    const expectedDirectoryEntriesOffset = buffer.byteLength - 4 - 92 * 2;

    console.assert(
      directoryEntriesOffset === expectedDirectoryEntriesOffset,
      `Directory entries offset did not match expected: ${directoryEntriesOffset} !== ${expectedDirectoryEntriesOffset}`
    );

    // Validate total directory entries
    const totalDirectoryEntries = buffer.readInt32LE(directoryEntriesOffset);

    console.assert(
      totalDirectoryEntries === 2,
      `Number of directory entries larger than expected: ${totalDirectoryEntries}`
    );

    const directoryEntriesStartIndex = directoryEntriesOffset + 4;

    console.log({
      ...header,
      directoryEntries: [
        readDirectoryEntry(buffer, directoryEntriesStartIndex),
        readDirectoryEntry(
          buffer,
          directoryEntriesStartIndex + DIRECTORY_ENTRY_LENGTH + 1
        ),
      ],
    });
  })
)();
