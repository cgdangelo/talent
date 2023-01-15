import { Frame, IDemoEventEmitter, parseDemo, UserMessage } from '@cgdangelo/talent-parser-goldsrc';
import { NetworkMessages } from '@cgdangelo/talent-parser-goldsrc/lib/frame/networkMessages/NetworkMessages';
import { EventEmitter } from 'events';
import { PathLike } from 'fs';
import { readFile } from 'fs/promises';
import {
  filter,
  from,
  fromEvent,
  map,
  merge,
  mergeMap,
  Observable,
  reduce,
  takeUntil,
  withLatestFrom
} from 'rxjs';

/**
 * @param demoPath - Path to a demo file.
 */
async function main(demoPath?: PathLike): Promise<void> {
  if (!demoPath) {
    throw new Error('No demo path provided.');
  }

  // Load the demo into memory.
  const fileContents = await readFile(demoPath);

  // Create an event bus for the demo parser.
  const demoEvents: IDemoEventEmitter = new EventEmitter();

  const demoEnd$: Observable<void> = fromEvent(demoEvents, 'demo:end');

  const frame$: Observable<Frame> = fromEvent(demoEvents, 'demo:frame').pipe(
    takeUntil(demoEnd$),
    filter((a): a is Frame => true)
  );

  const networkMessages$: Observable<NetworkMessages> = frame$.pipe(
    filter((frame): frame is NetworkMessages => frame.type === 'NetworkMessages')
  );

  const userMessage$: Observable<UserMessage & { parentFrame: NetworkMessages }> = networkMessages$.pipe(
    mergeMap((networkMessages) =>
      from(networkMessages.frameData.messages).pipe(
        filter((message) => message.type === 'user'),
        map((message) => message.message as UserMessage),
        map((userMessage) => ({ ...userMessage, parentFrame: networkMessages }))
      )
    )
  );

  const roundState$ = userMessage$.pipe(
    filter((userMessage) => userMessage.name === 'RoundState'),
    map((roundState) => ({ ...roundState, data: roundState.data.readInt8(0) }))
  );

  const roundStateChange$: Observable<IRoundStateChangeEvent> = roundState$.pipe(
    map((roundState) => ({
      type: (() => {
        switch (roundState.data) {
          case 0:
            return 'reset' as const;
          case 1:
            return 'normal' as const;
          case 3:
            return 'win-allies' as const;
          case 4:
            return 'win-axis' as const;

          default:
            return 'unknown' as const;
        }
      })(),

      timeS: roundState.parentFrame.header.time
    }))
  );

  const roundStart$ = roundStateChange$.pipe(
    filter((roundStateChange) => roundStateChange.type === 'normal')
  );

  const roundWin$: Observable<IRoundWinEvent> = roundStateChange$.pipe(
    filter((roundStateChange) => roundStateChange.type.startsWith('win')),
    withLatestFrom(roundStart$),
    map(([roundStateWin, roundStateStart]) => ({
      roundDurationS: roundStateWin.timeS - roundStateStart.timeS,
      team: roundStateWin.type.slice(roundStateWin.type.indexOf('-') + 1) as IRoundWinEvent['team'],
      timeS: roundStateWin.timeS
    }))
  );

  const roundWinLogger$ = roundWin$.pipe(
    map((roundWin) => {
      const winningTeam = roundWin.team;
      const frameTime = `t=${roundWin.timeS.toFixed(3)}`;

      return `Round win: ${winningTeam} | ${frameTime}`;
    })
  );

  const roundDurationMetrics$ = roundWin$.pipe(
    reduce((acc, cur, index) => (acc * index + cur.roundDurationS) / (index + 1), 0),
    map((meanRoundDurationS) => `Mean round duration: ${meanRoundDurationS}`)
  );

  merge(roundWinLogger$, roundDurationMetrics$).subscribe(console.debug);

  // Run the parser; the parser will emit events through the `demoEvents` bus as the file is evaluated.
  parseDemo(fileContents, demoEvents);
}

/** Emitted when RoundState message is parsed. */
interface IRoundStateChangeEvent {
  /** Type of the round state. */
  type:
    | 'reset' // Round reset (freeze time).
    | 'normal' // Round start.
    | 'unknown' // 2 | ???
    | `win-${'allies' | 'axis'}`; // Allies or axis team won the round.

  /** Time, in seconds, since beginning of demo. */
  timeS: number;
}

/** Emitted when one team completes all objectives and wins the round. */
interface IRoundWinEvent {
  /** Name of the team that won the round. */
  team: 'allies' | 'axis';

  /** Time, in seconds, between the round start event and the round win event. */
  roundDurationS: number;

  /** Time, in seconds, since beginning of demo. */
  timeS: number;
}

main(process.argv[2]).catch(console.error);
