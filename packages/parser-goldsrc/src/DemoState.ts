import type { StatefulParser } from "@talent/parser/lib/StatefulParser";

export type DemoStateParser<A> = StatefulParser<DemoState, number, A>;

export type DemoState = {
  readonly networkProtocol: number;
};

export const initialState: DemoState = {
  networkProtocol: 0,
};
