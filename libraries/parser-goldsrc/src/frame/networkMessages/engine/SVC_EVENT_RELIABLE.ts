import { statefulParser as SP } from '@cgdangelo/talent-parser';
import * as BB from '@cgdangelo/talent-parser-bitbuffer';
import { success } from '@cgdangelo/talent-parser/lib/ParseResult';
import { stream } from '@cgdangelo/talent-parser/lib/Stream';
import { pipe } from 'fp-ts/lib/function';
import type { Delta } from '../../../delta';
import { readDelta } from '../../../delta';
import * as DS from '../../../DemoState';
import { MessageType } from '../MessageType';

export type EventReliable = {
  readonly id: MessageType.SVC_EVENT_RELIABLE;
  readonly name: 'SVC_EVENT_RELIABLE';

  readonly fields: {
    readonly eventIndex: number;
    readonly eventArgs: Delta;
    readonly fireTime?: number;
  };
};

const fireTime = BB.bitFlagged(() => BB.ubits(16));

export const eventReliable: DS.DemoStateParser<EventReliable> = (s) => (i) =>
  pipe(
    stream(i.buffer, i.cursor * 8),

    pipe(
      DS.lift(BB.ubits(10)),
      SP.bindTo('eventIndex'),

      SP.bind('eventArgs', () => readDelta('event_t')),

      SP.bind('fireTime', () => SP.lift(fireTime)),

      SP.chain((a) =>
        SP.lift((o) =>
          success(a, i, stream(o.buffer, o.cursor % 8 === 0 ? o.cursor / 8 : Math.floor(o.cursor / 8) + 1))
        )
      ),

      SP.map(
        (fields) =>
          ({
            id: MessageType.SVC_EVENT_RELIABLE,
            name: 'SVC_EVENT_RELIABLE',
            fields
          } as const)
      )
    )(s)
  );
