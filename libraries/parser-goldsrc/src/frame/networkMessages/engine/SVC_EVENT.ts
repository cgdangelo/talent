import { parser as P, statefulParser as SP } from '@cgdangelo/talent-parser';
import * as BB from '@cgdangelo/talent-parser-bitbuffer';
import { success } from '@cgdangelo/talent-parser/lib/ParseResult';
import { stream } from '@cgdangelo/talent-parser/lib/Stream';
import { pipe } from 'fp-ts/lib/function';
import type { Delta } from '../../../delta';
import { readDelta } from '../../../delta';
import * as DS from '../../../DemoState';
import { MessageType } from '../MessageType';

export type Event = {
  readonly id: MessageType.SVC_EVENT;
  readonly name: 'SVC_EVENT';

  readonly fields: {
    readonly events: readonly {
      readonly eventIndex: number;
      readonly packetIndex?: number;
      readonly delta?: Delta;
      readonly fireTime?: number;
    }[];
  };
};

export const event: DS.DemoStateParser<Event> = (s) => (i) =>
  pipe(
    stream(i.buffer, i.cursor * 8),

    pipe(
      DS.lift(BB.ubits(5)),

      SP.chain((eventCount) => SP.manyN(event_, eventCount)),

      SP.bindTo('events'),

      SP.chain((a) =>
        SP.lift((o) =>
          success(a, i, stream(o.buffer, o.cursor % 8 === 0 ? o.cursor / 8 : Math.floor(o.cursor / 8) + 1))
        )
      ),

      SP.map(
        (fields) =>
          ({
            id: MessageType.SVC_EVENT,
            name: 'SVC_EVENT',
            fields
          } as const)
      )
    )(s)
  );

const event_ = pipe(
  DS.lift(
    P.struct({
      eventIndex: BB.ubits(10),
      packetIndex: BB.bitFlagged(() => BB.ubits(11))
    })
  ),

  SP.bind('delta', ({ packetIndex }) =>
    typeof packetIndex !== 'undefined' && packetIndex !== null
      ? pipe(
          DS.lift(BB.ubits(1)),
          SP.chain((hasDelta) => (hasDelta !== 0 ? readDelta('event_t') : SP.of(undefined)))
        )
      : SP.of(undefined)
  ),

  SP.bind('fireTime', () => SP.lift(BB.bitFlagged(() => BB.ubits(16))))
);
