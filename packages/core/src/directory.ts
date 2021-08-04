import * as P from "@talent/parser";
import { sequenceT } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";
import type { DirectoryEntry } from "./directoryEntry";
import { directoryEntry } from "./directoryEntry";
import { toError } from "./utils";

export type Directory = {
  readonly entries: readonly DirectoryEntry[];
};

const directoryOffset: P.Parser<Buffer, number> = (i) =>
  pipe(
    P.uint32_le,
    P.chain((a) =>
      a === i.buffer.byteLength - 4 - 92 * 2
        ? P.succeed(a)
        : P.fail(
            toError(
              `directory entries offset did not match expected ${
                i.buffer.byteLength - 4 - 92 * 2
              }`
            )(a)
          )
    ),
    (x) => x(i)
  );

const validateDirectoryEntries: P.Parser<Buffer, number> = pipe(
  P.int32_le,
  P.chain((a) =>
    a === 2
      ? P.succeed(a)
      : P.fail(toError("unexpected number of directory entries")(a))
  )
);

const directoryEntries: P.Parser<Buffer, readonly DirectoryEntry[]> = pipe(
  directoryOffset,
  P.chain((a) =>
    pipe(
      P.seek<Buffer>(a),
      P.chain(() => validateDirectoryEntries),
      P.chain(() =>
        sequenceT(P.Applicative)(
          directoryEntry,
          P.seek<Buffer>(a + 96),
          directoryEntry
        )
      ),
      P.map(([a, _, b]) => [a, b])
    )
  )
);

export const directory: P.Parser<Buffer, Directory> = pipe(
  directoryEntries,
  P.map((entries) => ({ entries }))
);
