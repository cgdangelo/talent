import * as BB from "@talent/parser-bitbuffer";
import type { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";

export type Pings = readonly {
  readonly playerId: number;
  readonly ping: number;
  readonly loss: number;
}[];

export const pings: B.BufferParser<Pings> = pipe(
  P.skip<number>(1),
  P.apSecond(
    P.manyTill(
      P.struct({
        playerId: BB.ubits(5),
        ping: BB.ubits(12),
        loss: BB.ubits(7),
      }),

      pipe(
        BB.ubits(1),
        P.filter((a) => !!a)
      )
    )
  ),
  BB.nextByte
);
