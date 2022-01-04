import type { buffer as B } from "@talent/parser-buffer";
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
  DS.lift(header) as DS.DemoStateParser<DemoHeader>,
  DS.bindTo("header"),
  DS.chainFirst(({ header: { networkProtocol } }) =>
    DS.put({ networkProtocol })
  ),
  DS.bind("directory", () => DS.lift(directory))
);

export const demo: B.BufferParser<Demo> = pipe(
  demo_,
  DS.evaluate(DS.initialState)
);
