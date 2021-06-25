import { either as E } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import type { DirectoryEntry } from "./directory-entry";
import { directoryEntry } from "./directory-entry";

const DIRECTORY_ENTRY_LENGTH = 4 + 64 + 8 + 12;

export type Directory = {
  readonly entries: readonly DirectoryEntry[];
};

export const directory = (buffer: Buffer): E.Either<Error, Directory> =>
  pipe(
    directoryOffset(buffer),
    E.chain(directoryEntries(buffer)),
    E.map((entries) => ({ entries }))
  );

const directoryOffset = (buffer: Buffer) =>
  pipe(
    buffer.readUInt32LE(540),
    E.fromPredicate(
      (a) => a === buffer.byteLength - 4 - 92 * 2,
      (a) => new Error(`directory entries offset did not match expected: ${a}`)
    )
  );

const directoryEntries = (buffer: Buffer) => (directoryOffset: number) =>
  pipe(
    validateDirectoryEntries(buffer)(directoryOffset),

    E.map(() => [
      directoryEntry(buffer)(directoryOffset),
      directoryEntry(buffer)(directoryOffset + DIRECTORY_ENTRY_LENGTH + 8),
    ])
  );

const validateDirectoryEntries =
  (buffer: Buffer) => (directoryOffset: number) =>
    pipe(
      buffer.readInt32LE(directoryOffset),
      E.fromPredicate(
        (a) => a === 2,
        (a) => new Error(`unexpected number of directory entries: ${a}`)
      )
    );
