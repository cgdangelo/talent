import * as BB from "@talent/parser-bitbuffer";
import type { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { stream } from "@talent/parser/lib/Stream";
import { readonlyArray as RA } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import type { Delta } from "../../../delta";
import { readDelta } from "../../../delta";

type DeltaPacketEntity = {
  readonly entityIndex: number;
  readonly entityState: Delta | null;
};

export type DeltaPacketEntities = {
  readonly entityCount: number;
  readonly entityStates: readonly DeltaPacketEntity[];
};

const entityState = (entityIndex: number) =>
  pipe(
    BB.ubits(1),

    P.chain((hasCustomDelta) =>
      pipe(
        readDelta(
          entityIndex > 0 && entityIndex < 33
            ? "entity_state_player_t"
            : hasCustomDelta !== 0
            ? "custom_entity_state_t"
            : "entity_state_t"
        ),

        P.map((entityState) => ({
          entityIndex,
          entityState,
        }))
      )
    )
  );

const entityStates: B.BufferParser<DeltaPacketEntities["entityStates"]> =
  (() => {
    let entityIndex = 0;

    return pipe(
      P.many(
        pipe(
          BB.ubits(16),
          P.filter((footer) => footer !== 0),
          P.apSecond(P.skip(-16)),

          P.apSecond(
            pipe(
              P.struct({
                removeEntity: BB.ubits(1),
                hasAbsoluteEntityNumber: BB.ubits(1),
              }),

              P.chainFirst(({ hasAbsoluteEntityNumber }) =>
                pipe(
                  hasAbsoluteEntityNumber !== 0
                    ? pipe(
                        BB.ubits(11),
                        P.map(
                          (nextEntityIndex) => nextEntityIndex - entityIndex
                        )
                      )
                    : BB.ubits(6),
                  P.map((entityIndexDiff) => (entityIndex += entityIndexDiff))
                )
              )
            )
          ),

          P.chain(({ removeEntity }) =>
            removeEntity === 0
              ? entityState(entityIndex)
              : P.of<number, DeltaPacketEntity>({
                  entityIndex,
                  entityState: null,
                })
          )
        )
      ),
      P.map(RA.filter((a): a is DeltaPacketEntity => a != null)),
      P.apFirst(P.skip(16))
    );
  })();

export const deltaPacketEntities: B.BufferParser<DeltaPacketEntities> = (i) =>
  pipe(
    stream(i.buffer, i.cursor * 8),

    pipe(
      P.struct({
        entityCount: BB.ubits(16),
        deltaUpdateMask: BB.ubits(8),
        entityStates,
      }),
      BB.nextByte
    )
  );
