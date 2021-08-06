import { buffer as B, parser as P } from "@talent/parser";
import { sequenceT } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";
import type { DirectoryEntry } from "./directoryEntry";
import { directoryEntry } from "./directoryEntry";
import { toError } from "./utils";

export type Directory = {
  readonly entries: readonly DirectoryEntry[];
};

const directoryOffset: B.BufferParser<number> = (i) =>
  pipe(
    B.uint32_le,
    P.chain((a) =>
      a === i.buffer.byteLength - 4 - 92 * 2
        ? P.succeed(a)
        : P.fail(
            `directory entries offset did not match expected ${
              i.buffer.byteLength - 4 - 92 * 2
            }`
          )
    ),
    (x) => x(i)
  );

const validateDirectoryEntries: B.BufferParser<number> = pipe(
  B.int32_le,
  P.chain((a) =>
    a === 2
      ? P.succeed(a)
      : P.fail(toError("unexpected number of directory entries")(a))
  )
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
