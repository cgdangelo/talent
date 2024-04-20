import { statefulParser as SP } from '@cgdangelo/talent-parser';
import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import * as P from '@cgdangelo/talent-parser/lib/Parser';
import { pipe } from 'fp-ts/lib/function';
import * as DS from '../../DemoState';
import { type Point } from '../../Point';
import { point } from '../../Point';
import { type FrameHeader } from '../FrameHeader';
import { frameHeader } from '../FrameHeader';
import { type Message } from './Message';
import { messages } from './Message';
import { type MoveVars } from './MoveVars';
import { moveVars } from './MoveVars';
import { type RefParams } from './RefParams';
import { refParams } from './RefParams';
import { type UserCmd } from './UserCmd';
import { userCmd } from './UserCmd';

export type NetworkMessages = {
  readonly header: FrameHeader;
  readonly type: 'NetworkMessages';
  readonly frameData: {
    readonly timestamp: number;
    readonly refParams: RefParams;
    readonly userCmd: UserCmd;
    readonly moveVars: MoveVars;
    readonly view: Point;
    readonly viewModel: number;
    readonly incomingSequence: number;
    readonly incomingAcknowledged: number;
    readonly incomingReliableAcknowledged: number;
    readonly incomingReliableSequence: number;
    readonly outgoingSequence: number;
    readonly reliableSequence: number;
    readonly lastReliableSequence: number;
    readonly messages: readonly Message[];
  };
};

const messagesLength: B.BufferParser<number> = P.expected(
  pipe(
    B.uint32_le,
    P.filter((a) => a >= 0 && a <= 65_536)
  ),
  'message length [0, 65_536]'
);

export const networkMessages: DS.DemoStateParser<NetworkMessages> = pipe(
  DS.lift(frameHeader),
  SP.bindTo('header'),

  SP.bind('type', () => SP.of('NetworkMessages' as const)),

  SP.bind('frameData', () =>
    pipe(
      DS.lift(
        P.struct({
          timestamp: B.float32_le,
          refParams,
          userCmd,
          moveVars,
          view: point,
          viewModel: B.int32_le,
          incomingSequence: B.int32_le,
          incomingAcknowledged: B.int32_le,
          incomingReliableAcknowledged: B.int32_le,
          incomingReliableSequence: B.int32_le,
          outgoingSequence: B.int32_le,
          reliableSequence: B.int32_le,
          lastReliableSequence: B.int32_le
        })
      ),

      SP.bind('messages', () => pipe(DS.lift(messagesLength), SP.chain(messages)))
    )
  )
);
