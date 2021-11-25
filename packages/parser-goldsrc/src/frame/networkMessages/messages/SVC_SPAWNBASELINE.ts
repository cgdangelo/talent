import * as BB from "@talent/parser-bitbuffer";
import type { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { stream } from "@talent/parser/lib/Stream";
import { success } from "@talent/parser/src/ParseResult";
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

          P.chain((entity) =>
            pipe(
              readDelta(
                (entity.type & 1) !== 0
                  ? entity.index > 0 && entity.index < 33
                    ? "entity_state_player_t"
                    : "entity_state_t"
                  : "custom_entity_state_t"
              ),
              P.map((delta) => ({ ...entity, delta }))
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

      P.chainFirst(() =>
        pipe(
          BB.ubits(5),
          P.filter((footer) => footer === (1 << 5) - 1)
        )
      ),

      P.chain((entities) =>
        pipe(
          BB.ubits(6),
          P.chain((n) => P.manyN(readDelta("entity_state_t"), n)),
          P.map((extraData) => ({ entities, extraData })),
          P.alt(() => P.of({ entities }))
        )
      ),

      P.apFirst(BB.nextByte),
      P.chain((a) => (o) => success(a, o, stream(o.buffer, o.cursor / 8)))
    )
  );
