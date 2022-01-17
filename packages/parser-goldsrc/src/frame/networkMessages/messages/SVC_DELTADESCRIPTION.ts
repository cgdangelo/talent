import { statefulParser as SP } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { readonlyMap as RM, string } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import type { DeltaFieldDecoder } from "../../../delta";
import { readDelta } from "../../../delta";
import type { DemoState, DemoStateParser } from "../../../DemoState";

export type DeltaDescription = {
  readonly name: string;
  readonly fields: readonly DeltaFieldDecoder[];
};

const addDeltaDecoder = RM.upsertAt(string.Eq);

export const deltaDescription: DemoStateParser<DeltaDescription> = pipe(
  SP.lift<number, string, DemoState>(B.ztstr),
  SP.bindTo("name"),
  SP.bind("fields", () =>
    pipe(
      SP.lift<number, number, DemoState>(B.uint16_le),
      SP.chain((fieldCount) =>
        SP.manyN(
          readDelta<DeltaFieldDecoder>("delta_description_t"),
          fieldCount
        )
      )
    )
  ),
  SP.chainFirst(({ name, fields }) =>
    SP.modify((s) => ({
      ...s,
      deltaDecoders: pipe(s.deltaDecoders, addDeltaDecoder(name, fields)),
    }))
  )
);
