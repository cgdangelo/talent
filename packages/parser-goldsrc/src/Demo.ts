import type { buffer as B } from "@talent/parser-buffer";
import * as SP from "@talent/parser/lib/StatefulParser";
import { pipe } from "fp-ts/lib/function";
import type { DemoHeader } from "./DemoHeader";
import { header } from "./DemoHeader";
import * as DS from "./DemoState";
import type { Directory } from "./Directory";
import { directory } from "./Directory";

export type Demo = {
  readonly header: DemoHeader;
  readonly directory: Directory;
};

export const demo_: DS.DemoStateParser<Demo> = pipe(
  DS.lift(header),
  SP.bindTo("header"),
  SP.chainFirst(({ header: { networkProtocol } }) =>
    SP.modify((s) => ({ ...s, networkProtocol }))
  ),
  SP.bind("directory", ({ header: { directoryOffset } }) =>
    directory(directoryOffset)
  )
);

export const demo: B.BufferParser<Demo> = pipe(
  demo_,
  SP.evaluate(DS.initialState)
);
