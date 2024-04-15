import type { buffer as B } from '@cgdangelo/talent-parser-buffer';
import * as SP from '@cgdangelo/talent-parser/lib/StatefulParser';
import { pipe } from 'fp-ts/lib/function';
import { IDemoEventEmitter } from './DemoEventEmitter';
import type { DemoHeader } from './DemoHeader';
import { header } from './DemoHeader';
import * as DS from './DemoState';
import type { Directory } from './Directory';
import { directory } from './Directory';

export type Demo = {
  readonly header: DemoHeader;
  readonly directory: Directory;
};

export const demo_: DS.DemoStateParser<Demo> = pipe(
  // Emit parse start event.
  SP.get<number, DS.DemoState>(),
  SP.map(({ eventEmitter }) => eventEmitter?.emit('demo:start')),

  SP.chain(() => DS.lift(header)),
  SP.bindTo('header'),

  // Emit demo header event.
  SP.chainFirst(({ header }) =>
    pipe(
      SP.get<number, DS.DemoState>(),
      SP.map(({ eventEmitter }) => eventEmitter?.emit('demo:header', header))
    )
  ),

  SP.chainFirst(({ header: { networkProtocol } }) => SP.modify((s) => ({ ...s, networkProtocol }))),
  SP.bind('directory', () => directory),

  // Emit parse end event.
  SP.chainFirst(() =>
    pipe(
      SP.get<number, DS.DemoState>(),
      SP.map(({ eventEmitter }) => eventEmitter?.emit('demo:end'))
    )
  )
);

export const demo: (eventEmitter?: IDemoEventEmitter) => B.BufferParser<Demo> = (eventEmitter) =>
  pipe(demo_, SP.evaluate({ ...DS.initialState, eventEmitter } as DS.DemoState));
