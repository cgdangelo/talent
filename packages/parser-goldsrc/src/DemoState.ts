import type { StatefulParser } from "@talent/parser/lib/StatefulParser";
import { readonlyMap as RM } from "fp-ts";
import type { DeltaDecoder } from "./delta";
import { initialDeltaDecoders } from "./delta";
import type { NewUserMsg } from "./frame/networkMessages/messages";

export type DemoStateParser<A> = StatefulParser<DemoState, number, A>;

export type DemoState = {
  readonly deltaDecoders: ReadonlyMap<string, DeltaDecoder>;
  readonly networkProtocol: number;
  readonly userMessages: ReadonlyMap<number, NewUserMsg>;
};

export const initialState: DemoState = {
  deltaDecoders: initialDeltaDecoders,
  networkProtocol: 0,
  userMessages: RM.empty,
};
