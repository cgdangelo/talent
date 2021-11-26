import * as BB from "@talent/parser-bitbuffer";
import type { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { success } from "@talent/parser/lib/ParseResult";
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

  readonly consistency?: number[];
};

const resource = pipe(
  P.struct({
    type: BB.ubits(4),
    name: BB.ztstr,
    index: BB.ubits(12),
    size: BB.ubits(24),
    flags: BB.ubits(3),
  }),

  P.chain((resource) =>
    pipe(
      P.of<number, number>(resource.flags),
      P.filter((flags) => (flags & 4) !== 0),
      P.apSecond(BB.ubits(128)),
      P.map((md5Hash) => ({ ...resource, md5Hash })),
      P.alt(() => P.of(resource))
    )
  ),

  // TODO this still feels wrong; what if no md5hash?
  P.chain((resource) =>
    pipe(
      BB.ubits(1),
      P.filter((hasExtraInfo) => hasExtraInfo !== 0),
      P.apSecond(BB.ubits(256)),
      P.map((extraInfo) => ({ ...resource, extraInfo })),
      P.alt(() =>
        pipe(P.of<number, typeof resource>(resource), P.apFirst(P.skip(1)))
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
      P.apFirst(BB.nextByte),
      P.chain((a) => (o) => success(a, o, stream(o.buffer, o.cursor / 8)))
    )
  );
