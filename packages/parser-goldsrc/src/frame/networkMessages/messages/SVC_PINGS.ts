import * as BB from "@talent/parser-bitbuffer";
import type { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { stream } from "@talent/parser/lib/Stream";
import { pipe } from "fp-ts/lib/function";

export type Pings = readonly {
  readonly playerId: number;
  readonly ping: number;
  readonly loss: number;
}[];

export const pings: B.BufferParser<Pings> = (i) =>
  pipe(
    stream(i.buffer, i.cursor * 8),

    pipe(
      P.many(
        pipe(
          BB.ubits(1),
          P.filter((hasPing) => hasPing !== 0),
          P.apSecond(
            P.struct({
              playerId: BB.ubits(5),
              ping: BB.ubits(12),
              loss: BB.ubits(7),
            })
          )
        )
      ),
      P.apFirst(P.skip(1)),
      BB.nextByte
    )
  );
