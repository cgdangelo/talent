import * as BB from "@talent/parser-bitbuffer";
import type { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { stream } from "@talent/parser/lib/Stream";
import { number, ord, readonlyArray as RA } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import type { Delta } from "../../../delta";
import { readDelta } from "../../../delta";

export type SpawnBaseline = {
  readonly entities: readonly {
    readonly index: number;
    readonly type: number;
    readonly delta: Delta;
  }[];
  readonly extraData?: readonly Delta[];
};

export const spawnBaseline: B.BufferParser<SpawnBaseline> = (i) =>
  pipe(
    stream(i.buffer, i.cursor * 8),

    pipe(
      P.manyTill(
        pipe(
          P.struct({ index: BB.ubits(11), type: BB.ubits(2) }),

          P.bind("delta", ({ index, type }) =>
            readDelta(
              (type & 1) !== 0
                ? index > 0 && index < 33
                  ? "entity_state_player_t"
                  : "entity_state_t"
                : "custom_entity_state_t"
            )
          )
        ),

        pipe(
          BB.ubits(11),
          P.filter((entityIndex) => entityIndex === (1 << 11) - 1)
        )
      ),

      // TODO Possibly unnecessary, check order
      P.map(
        pipe(
          number.Ord,
          ord.contramap(({ index }: { index: number }) => index),
          RA.sort
        )
      ),

      P.bindTo("entities"),

      P.chainFirst(() =>
        pipe(
          BB.ubits(5),
          P.filter((footer) => footer === (1 << 5) - 1)
        )
      ),

      P.bind("extraData", () =>
        pipe(
          BB.ubits(6),
          P.chain((n) => P.manyN(readDelta("entity_state_t"), n))
        )
      ),

      BB.nextByte
    )
  );
