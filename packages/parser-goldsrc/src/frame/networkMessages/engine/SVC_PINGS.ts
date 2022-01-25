import * as BB from "@talent/parser-bitbuffer";
import type { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { stream } from "@talent/parser/lib/Stream";
import { pipe } from "fp-ts/lib/function";
import { MessageType } from "../MessageType";

export type Pings = {
  readonly id: MessageType.SVC_PINGS;
  readonly name: "SVC_PINGS";

  readonly fields: {
    readonly pings: readonly {
      readonly playerId: number;
      readonly ping: number;
      readonly loss: number;
    }[];
  };
};

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
              playerId: BB.ubits(8),
              ping: BB.ubits(8),
              loss: BB.ubits(8),
            })
          )
        )
      ),
      P.bindTo("pings"),
      P.apFirst(P.skip(1)),
      BB.nextByte,

      P.map((fields) => ({
        id: MessageType.SVC_PINGS,
        name: "SVC_PINGS",
        fields,
      }))
    )
  );
