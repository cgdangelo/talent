import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { sequenceT } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";
import type { DirectoryEntry } from "./directoryEntry";
import { directoryEntry } from "./directoryEntry";

export type Directory = {
  readonly entries: readonly DirectoryEntry[];
};

const directoryOffset: B.BufferParser<number> = (i) =>
  pipe(
    P.sat(
      B.uint32_le,
      (a) => a === i.buffer.byteLength - 4 - 92 * 2,
      (a) =>
        `expected ${
          i.buffer.byteLength - 4 - 92 * 2
        } for directory offset, got ${a}`
    ),
    (x) => x(i)
  );

const validateDirectoryEntries: B.BufferParser<2> = P.sat(
  B.int32_le,
  (a): a is 2 => a === 2,
  (a) => `expected 2 directory entries, got ${a}`
);

const directoryEntries: B.BufferParser<readonly DirectoryEntry[]> = pipe(
  directoryOffset,
  P.chain((a) =>
    pipe(
      P.seek(a),
      P.chain(() => validateDirectoryEntries),
      P.chain(() =>
        sequenceT(P.Applicative)(directoryEntry, P.seek(a + 96), directoryEntry)
      ),
      P.map(([a, _, b]) => [a, b])
    )
  )
);

export const directory: B.BufferParser<Directory> = pipe(
  directoryEntries,
  P.map((entries) => ({ entries }))
);
