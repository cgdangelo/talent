import type { StatefulParser } from "@talent/parser/lib/StatefulParser";
import { readonlyMap as RM } from "fp-ts";
import type { DeltaDecoder } from "./delta";

export type DemoStateParser<A> = StatefulParser<DemoState, number, A>;

export type DemoState = {
  readonly deltaDecoders: ReadonlyMap<string, DeltaDecoder>;
  readonly networkProtocol: number;
};

export const initialState: DemoState = {
  deltaDecoders: RM.empty,
  networkProtocol: 0,
};
