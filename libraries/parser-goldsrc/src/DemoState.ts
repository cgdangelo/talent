import { type parser as P, statefulParser as SP } from '@cgdangelo/talent-parser';
import { readonlyMap as RM } from 'fp-ts';
import { type DeltaDecoder, initialDeltaDecoders } from './delta';
import { type IDemoEventEmitter } from './DemoEventEmitter';
import { type NewUserMsg } from './frame/networkMessages/engine';

export type DemoStateParser<A> = SP.StatefulParser<DemoState, number, A>;

export const get: () => SP.StatefulParser<DemoState, number, DemoState> = () => SP.get();

export const lift: <A>(p: P.Parser<number, A>) => DemoStateParser<A> = SP.lift;

export type DemoState = {
  readonly deltaDecoders: ReadonlyMap<string, DeltaDecoder>;
  readonly eventEmitter?: IDemoEventEmitter;
  readonly isHLTV: boolean;
  readonly maxClients: number;
  readonly networkProtocol: number;
  readonly userMessages: ReadonlyMap<number, NewUserMsg['fields']>;
};

export const initialState: DemoState = {
  deltaDecoders: initialDeltaDecoders,
  isHLTV: false,
  maxClients: 0,
  networkProtocol: 0,
  userMessages: RM.empty
};
