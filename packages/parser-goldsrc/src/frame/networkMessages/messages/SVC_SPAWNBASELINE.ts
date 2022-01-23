import { parser as P, statefulParser as SP } from "@talent/parser";
import * as BB from "@talent/parser-bitbuffer";
import { success } from "@talent/parser/lib/ParseResult";
import { stream } from "@talent/parser/lib/Stream";
import { number, ord, readonlyArray as RA } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import type { Delta } from "../../../delta";
import { readDelta } from "../../../delta";
import type { DemoState, DemoStateParser } from "../../../DemoState";
import { MessageType } from "../MessageType";

export type SpawnBaseline = {
  readonly type: {
    readonly id: MessageType.SVC_SPAWNBASELINE;
    readonly name: "SVC_SPAWNBASELINE";
  };

  readonly fields: {
    readonly entities: readonly {
      readonly index: number;
      readonly type: number;
      readonly delta: Delta;
    }[];
    readonly extraData?: readonly Delta[];
  };
};

export const spawnBaseline: DemoStateParser<SpawnBaseline> = (s) => (i) =>
  pipe(
    stream(i.buffer, i.cursor * 8),

    pipe(
      SP.manyTill(
        pipe(
          SP.lift<number, number, DemoState>(BB.ubits(11)),
          SP.bindTo("index"),
          SP.bind("type", () => SP.lift(BB.ubits(2))),
          SP.bind("delta", ({ index, type }) =>
            readDelta(
              (type & 1) !== 0
                ? index > 0 && index < 33
                  ? "entity_state_player_t"
                  : "entity_state_t"
                : "custom_entity_state_t"
            )
          )
        ),

        SP.lift(
          pipe(
            BB.ubits(11),
            P.filter((entityIndex) => entityIndex === (1 << 11) - 1)
          )
        )
      ),

      // TODO Possibly unnecessary, check order
      SP.map(
        pipe(
          number.Ord,
          ord.contramap(({ index }: { index: number }) => index),
          RA.sort
        )
      ),

      SP.bindTo("entities"),

      SP.chainFirst(() =>
        SP.lift(
          pipe(
            BB.ubits(5),
            P.filter((footer) => footer === (1 << 5) - 1)
          )
        )
      ),

      SP.bind("extraData", () =>
        pipe(
          SP.lift<number, number, DemoState>(BB.ubits(6)),
          SP.chain((n) => SP.manyN(readDelta("entity_state_t"), n))
        )
      ),

      SP.chain((a) =>
        SP.lift((o) =>
          success(
            a,
            i,
            stream(
              o.buffer,
              o.cursor % 8 === 0 ? o.cursor / 8 : Math.floor(o.cursor / 8) + 1
            )
          )
        )
      ),

      SP.map((fields) => ({
        type: {
          id: MessageType.SVC_SPAWNBASELINE,
          name: "SVC_SPAWNBASELINE",
        } as const,
        fields,
      }))
    )(s)
  );
