import type { parser as P } from '@talent/parser';
import { statefulParser as SP } from '@talent/parser';
import { readonlyMap as RM } from 'fp-ts';
import type { DeltaDecoder } from './delta';
import { initialDeltaDecoders } from './delta';
import { IDemoEventEmitter } from './DemoEventEmitter';
import type { NewUserMsg } from './frame/networkMessages/engine';

export type DemoStateParser<A> = SP.StatefulParser<DemoState, number, A>;

export const lift: <A>(p: P.Parser<number, A>) => DemoStateParser<A> = SP.lift;

export type DemoState = {
  readonly deltaDecoders: ReadonlyMap<string, DeltaDecoder>;
  readonly eventEmitter?: IDemoEventEmitter;
  readonly maxClients: number;
  readonly networkProtocol: number;
  readonly userMessages: ReadonlyMap<number, NewUserMsg['fields']>;
};

export const initialState: DemoState = {
  deltaDecoders: initialDeltaDecoders,
  maxClients: 0,
  networkProtocol: 0,
  userMessages: RM.empty
};
