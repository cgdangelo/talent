import * as BB from "@talent/parser-bitbuffer";
import type { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { stream } from "@talent/parser/lib/Stream";
import { pipe } from "fp-ts/lib/function";

export type ResourceList = {
  readonly resources: readonly {
    readonly type: number;
    readonly name: string;
    readonly index: number;
    readonly size: number;
    readonly flags: number;
    readonly md5Hash?: number;
    readonly extraInfo?: number;
  }[];

  readonly consistency?: readonly number[];
};

const resource: B.BufferParser<ResourceList["resources"][number]> = pipe(
  P.struct({
    type: BB.ubits(4),
    name: BB.ztstr,
    index: BB.ubits(12),
    size: BB.ubits(24),
    flags: BB.ubits(3),
  }),

  P.bind("md5Hash", ({ flags }) =>
    (flags & 4) !== 0 ? BB.ubits(128) : P.of(undefined)
  ),

  P.bind("extraInfo", () =>
    pipe(
      BB.ubits(1),
      P.chain((hasExtraInfo) =>
        hasExtraInfo !== 0 ? BB.ubits(256) : P.of(undefined)
      )
    )
  )
);

export const resourceList: B.BufferParser<ResourceList> = (i) =>
  pipe(
    stream(i.buffer, i.cursor * 8),

    pipe(
      BB.ubits(12),
      P.chain((entryCount) => P.manyN(resource, entryCount)),
      P.chain((resources) =>
        pipe(
          BB.ubits(1),
          P.filter((hasConsistency) => hasConsistency !== 0),
          P.apSecond(
            P.manyTill(
              pipe(
                P.skip<number>(1),
                P.apSecond(BB.ubits(1)),
                P.chain((isShortIndex) => BB.ubits(isShortIndex ? 5 : 10))
              ),

              pipe(
                BB.ubits(1),
                P.filter((a) => a === 0)
              )
            )
          ),
          P.map((consistency) => ({ resources, consistency })),
          P.alt(() => P.of({ resources }))
        )
      ),
      BB.nextByte
    )
  );
