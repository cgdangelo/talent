import * as BB from "@talent/parser-bitbuffer";
import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { stream } from "@talent/parser/lib/Stream";
import { pipe } from "fp-ts/lib/function";
import type { DeltaFieldDecoder } from "../../../delta";
import { deltaDecoders, readDelta } from "../../../delta";

export type DeltaDescription = {
  readonly name: string;
  readonly fieldCount: number;
  readonly fields: readonly DeltaFieldDecoder[];
};

export const deltaDescription: B.BufferParser<DeltaDescription> = pipe(
  P.struct({
    name: B.ztstr,
    fieldCount: B.uint16_le,
    fields: P.of([]),
  }),

  P.chain(
    (delta) => (i) =>
      pipe(
        stream(i.buffer, i.cursor * 8),
        pipe(
          P.manyN(
            readDelta<DeltaFieldDecoder>("delta_description_t"),
            delta.fieldCount
          ),
          P.map((fields) => ({ ...delta, fields })),
          P.map((a) => {
            // TODO how to handle storing delta decoders?
            deltaDecoders.set(a.name, a.fields);

            return a;
          }),
          BB.nextByte
        )
      )
  )
);
