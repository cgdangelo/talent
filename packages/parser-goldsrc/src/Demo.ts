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

export const demo_ = pipe(
  DS.lift<number, DemoHeader, DS.DemoState>(header),
  DS.chainFirst(({ networkProtocol }) => DS.put({ networkProtocol })),
  DS.chain((header) =>
    pipe(
      DS.lift<number, Directory, DS.DemoState>(directory),
      DS.map((directory) => ({ header, directory }))
    )
  )
);

export const demo: B.BufferParser<Demo> = pipe(
  demo_,
  DS.evaluate(DS.initialState)
);
