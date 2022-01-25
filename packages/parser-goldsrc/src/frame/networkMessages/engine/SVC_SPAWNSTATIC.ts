import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "../../../Point";
import { MessageType } from "../MessageType";

export type SpawnStatic = {
  readonly id: MessageType.SVC_SPAWNSTATIC;
  readonly name: "SVC_SPAWNSTATIC";

  readonly fields: {
    readonly modelIndex: number;
    readonly sequence: number;
    readonly frame: number;
    readonly colorMap: number;
    readonly skin: number;
    readonly origin: Point;
    readonly angle: Point;
    readonly renderMode: number;
    readonly renderColor?: {
      readonly r: number;
      readonly g: number;
      readonly b: number;
    };
    readonly renderFx?: number;
  };
};

export const spawnStatic: B.BufferParser<SpawnStatic> = pipe(
  P.struct({
    modelIndex: B.int16_le,
    sequence: B.int8_le,
    frame: B.int8_le,
    colorMap: B.int16_le,
    skin: B.int8_le,
    // origin: point,
  }),

  // valve who did this i just wanna talk
  P.chain((a) =>
    pipe(
      // Origin and angle x-, y-, and z-coordinates alternate, and need
      // to be scaled.
      [
        pipe(
          B.int16_le,
          P.map((a) => a / 8)
        ),

        pipe(
          B.int8_le,
          P.map((a) => a * (360 / 256))
        ),
      ] as const,

      ([o, a]) => P.tuple(o, a, o, a, o, a),

      P.map(([ox, ax, oy, ay, oz, az]) => ({
        ...a,
        origin: { x: ox, y: oy, z: oz },
        angle: { x: ax, y: ay, z: az },
      }))
    )
  ),

  P.chain((a) =>
    pipe(
      P.struct({ renderMode: B.int8_le }),
      P.map((b) => ({ ...a, ...b }))
    )
  ),

  P.chain((a) =>
    pipe(
      P.of<number, number>(a.renderMode),
      P.filter((a) => a !== 0),
      P.apSecond(
        pipe(
          P.struct({
            renderColor: pipe(
              P.tuple(B.uint8_le, B.uint8_le, B.uint8_le),
              P.map(([r, g, b]) => ({ r, g, b }))
            ),
            renderFx: B.uint8_le,
          }),
          P.map((b) => ({ ...a, ...b }))
        )
      ),
      P.alt(() => P.of(a))
    )
  ),

  P.map((fields) => ({
    id: MessageType.SVC_SPAWNSTATIC,
    name: "SVC_SPAWNSTATIC",
    fields,
  }))
);
