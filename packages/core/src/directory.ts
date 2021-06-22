import { either as E } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import type { DirectoryEntry } from "./directory-entry";
import { readDirectoryEntry } from "./directory-entry";

export type Directory = {
  readonly entries: readonly DirectoryEntry[];
};

const DIRECTORY_ENTRY_LENGTH =
  4 + // Unknown
  64 + // Title
  8 + // "flags, cdtrack" ?
  12; // "frames, offset and length"

export const readDirectory = (buffer: Buffer): E.Either<Error, Directory> =>
  pipe(
    readDirectoryOffset(buffer),
    E.chainFirst(checkTotalDirectoryEntries(buffer)),
    E.map(readDirectoryEntries(buffer)),
    E.map((entries) => ({ entries }))
  );

export const readDirectoryOffset = (buffer: Buffer): E.Either<Error, number> =>
  pipe(
    buffer.readUInt32LE(540),
    E.fromPredicate(
      (a) => a === buffer.byteLength - 4 - 92 * 2,
      (a) => new Error(`directory entries offset did not match expected: ${a}`)
    )
  );

export const checkTotalDirectoryEntries =
  (buffer: Buffer) =>
  (directoryOffset: number): E.Either<Error, number> =>
    pipe(
      buffer.readInt32LE(directoryOffset),
      E.fromPredicate(
        (a) => a === 2,
        (a) => new Error(`unexpected number of directory entries: ${a}`)
      )
    );

export const readDirectoryEntries =
  (buffer: Buffer) =>
  (directoryOffset: number): readonly DirectoryEntry[] =>
    [
      readDirectoryEntry(buffer, directoryOffset),
      readDirectoryEntry(buffer, directoryOffset + DIRECTORY_ENTRY_LENGTH + 8),
    ];
