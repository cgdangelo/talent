import {
  EngineMessage,
  Frame,
  IDemoEventEmitter,
  parseDemo,
  UserMessage
} from '@cgdangelo/talent-parser-goldsrc';
import { NetworkMessages } from '@cgdangelo/talent-parser-goldsrc/lib/frame/networkMessages/NetworkMessages';
import { EventEmitter } from 'events';
import { PathLike } from 'fs';
import { readFile } from 'fs/promises';
import {
  EMPTY,
  filter,
  from,
  fromEvent,
  map,
  merge,
  mergeMap,
  Observable,
  of,
  reduce,
  scan,
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
  const demoEvents: IDemoEventEmitter = new EventEmitter().setMaxListeners(Infinity);

  const demoEnd$: Observable<void> = fromEvent(demoEvents, 'demo:end');

  const frame$: Observable<Frame> = fromEvent(demoEvents, 'demo:frame').pipe(
    takeUntil(demoEnd$),
    filter((a): a is Frame => true)
  );

  const networkMessages$: Observable<NetworkMessages> = frame$.pipe(
    filter((frame): frame is NetworkMessages => frame.type === 'NetworkMessages')
  );

  const engineMessage$: Observable<EngineMessage & { parentFrame: NetworkMessages }> = networkMessages$.pipe(
    mergeMap((networkMessages) =>
      from(networkMessages.frameData.messages).pipe(
        filter((message) => message.type === 'engine'),
        map((message) => message.message as EngineMessage),
        map((engineMessage) => ({ ...engineMessage, parentFrame: networkMessages }))
      )
    )
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

  const roundStateChange$: Observable<IRoundStateChangeEvent> = userMessage$.pipe(
    filter((userMessage) => userMessage.name === 'RoundState'),
    map((roundState) => {
      const roundStateIndex = roundState.data.readInt8(0);

      const type = (() => {
        switch (roundStateIndex) {
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
      })();

      return { timeS: roundState.parentFrame.header.time, type };
    })
  );

  const roundReset$ = roundStateChange$.pipe(filter((roundStateChange) => roundStateChange.type === 'reset'));

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

  const roundFeed$ = merge(
    userMessage$.pipe(
      filter((userMessage) => userMessage.name === 'ClanTimer'),
      map((userMessage) => {
        const frameTime = `t=${userMessage.parentFrame.header.time.toFixed(3)}s`.padEnd(12);
        const timerLength = userMessage.data.readInt8(0);
        return `⚔️  | ${frameTime} | Clan timer START: ${timerLength}.`;
      })
    ),

    roundReset$.pipe(
      map((roundStateChange) => {
        const frameTime = `t=${roundStateChange.timeS.toFixed(3)}s`.padEnd(12);
        return `🟡 | ${frameTime} | Round RESET.`;
      })
    ),

    roundStart$.pipe(
      map((roundStateChange) => {
        const frameTime = `t=${roundStateChange.timeS.toFixed(3)}s`.padEnd(12);
        return `🟢 | ${frameTime} | Round START.`;
      })
    ),

    roundWin$.pipe(
      map((roundWin) => {
        const frameTime = `t=${roundWin.timeS.toFixed(3)}s`.padEnd(12);
        const winningTeam = `{${roundWin.team}}`;
        return `🔴 | ${frameTime} | Round WIN ${winningTeam}.`;
      })
    )
  );

  const roundDurationMetrics$ = roundWin$.pipe(
    reduce((acc, cur, index) => (acc * index + cur.roundDurationS) / (index + 1), 0),
    map((meanRoundDurationS) => `Mean round duration: ${meanRoundDurationS.toFixed(3)}.`)
  );

  const players$: Observable<Partial<Record<number, { name: string; team?: string }>>> = engineMessage$.pipe(
    mergeMap((engineMessage) => (engineMessage.name === 'SVC_UPDATEUSERINFO' ? of(engineMessage) : EMPTY)),
    filter((updateUserInfo) => updateUserInfo.fields.clientUserInfo['*hltv'] !== '1'),
    scan((acc, cur) => {
      const clientIndex = cur.fields.clientIndex;
      const name = cur.fields.clientUserInfo.name;
      const team = cur.fields.clientUserInfo.team;
      return { ...acc, [clientIndex]: { name, team } };
    })
  );

  const frag$: Observable<IFragEvent> = userMessage$.pipe(
    filter((userMessage) => userMessage.name === 'DeathMsg'),
    map((userMessage) => {
      const killerClientIndex = userMessage.data.readInt8(0) - 1;
      const victimClientIndex = userMessage.data.readInt8(1) - 1;
      const weaponIndex = userMessage.data.readInt8(2) - 1;

      return {
        timeS: userMessage.parentFrame.header.time,
        killerClientIndex: killerClientIndex === -1 ? victimClientIndex : killerClientIndex,
        victimClientIndex,
        weaponIndex
      };
    }),
    withLatestFrom(players$),
    map(([frag, players]) => {
      const killerName = players[frag.killerClientIndex]?.name;
      const victimName = players[frag.victimClientIndex]?.name;

      if (!killerName) {
        throw new Error(`Can't find killer {${frag.killerClientIndex}} to construct IFragEvent.`);
      }

      if (!victimName) {
        throw new Error(`Can't find victim {${frag.victimClientIndex}} to construct IFragEvent.`);
      }

      const isTeamkill = players[frag.killerClientIndex]?.team === players[frag.victimClientIndex]?.team;
      const weaponName = weaponIndexToName(frag.weaponIndex);

      return {
        timeS: frag.timeS,
        killerName,
        victimName,
        isTeamkill,
        weaponName
      };
    })
  );

  const killFeed$ = frag$.pipe(
    map((frag) => {
      const frameTime = `t=${frag.timeS.toFixed(3)}s`.padEnd(12);
      const killer = `{${frag.killerName}}`;
      const fragAction = `${frag.isTeamkill ? 'team' : ''}killed`;
      const victim = `{${frag.victimName}}`;
      const weaponName = `{${frag.weaponName}}`;

      return `💀 | ${frameTime} | ${killer} ${fragAction} ${victim} with ${weaponName}.`;
    })
  );

  const teamScore$: Observable<ITeamScoreEvent> = userMessage$.pipe(
    filter((userMessage) => userMessage.name === 'TeamScore'),
    map((userMessage) => {
      const teamIndex = userMessage.data.readInt8(0);
      const score = userMessage.data.readInt16LE(1);

      const team = (() => {
        switch (teamIndex) {
          case 1:
            return 'allies' as const;
          case 2:
            return 'axis' as const;
          default:
            return 'unknown' as const;
        }
      })();

      return { timeS: userMessage.parentFrame.header.time, team, score };
    })
  );

  const teamScores$ = teamScore$.pipe(
    map((teamScore) => ({ [teamScore.team]: teamScore.score })),
    scan((acc, cur) => ({ ...acc, ...cur }))
  );

  const teamScoreFeed$ = roundReset$.pipe(
    withLatestFrom(teamScores$),
    map(([roundStateChange, teamScore]) => {
      const frameTime = `t=${roundStateChange.timeS.toFixed(3)}s`.padEnd(12);
      const scoreState = `${JSON.stringify(teamScore)}`;

      return `📈 | ${frameTime} | Team scores: ${scoreState}`;
    })
  );

  merge(roundFeed$, roundDurationMetrics$, killFeed$, teamScoreFeed$).subscribe({
    next: console.log,
    error: console.error
  });

  // Run the parser; the parser will emit events through the `demoEvents` bus as the file is evaluated.
  parseDemo(fileContents, demoEvents);
}

/** Emitted when RoundState message is parsed. */
interface IRoundStateChangeEvent {
  /** Time, in seconds, since beginning of demo. */
  timeS: number;

  /** Type of the round state. */
  type:
    | 'reset' // Round reset (freeze time).
    | 'normal' // Round start.
    | 'unknown' // 2 | ???
    | `win-${'allies' | 'axis'}`; // Allies or axis team won the round.
}

/** Emitted when one team completes all objectives and wins the round. */
interface IRoundWinEvent {
  /** Time, in seconds, since beginning of demo. */
  timeS: number;

  /** Name of the team that won the round. */
  team: 'allies' | 'axis';

  /** Time, in seconds, between the round start event and the round win event. */
  roundDurationS: number;
}

interface IFragEvent {
  /** Time, in seconds, since beginning of demo. */
  timeS: number;

  /** Name of the killer at the time of the frag. */
  killerName: string;

  /** Name of the victim at the time of the frag. */
  victimName: string;

  /** True if killer and victim are on the same team. */
  isTeamkill: boolean;

  /** Name of the weapon used to kill the victim. */
  weaponName?: DoDWeapon;
}

interface ITeamScoreEvent {
  /** Time, in seconds, since beginning of demo. */
  timeS: number;
  team: string;
  score: number;
}

// eslint-disable-next-line @rushstack/typedef-var
const dodWeapons = [
  'DODW_AMERKNIFE',
  'DODW_GERKNIFE',
  'DODW_COLT',
  'DODW_LUGER',
  'DODW_GARAND',
  'DODW_SCOPED_KAR',
  'DODW_THOMPSON',
  'DODW_STG44',
  'DODW_SPRINGFIELD',
  'DODW_KAR',
  'DODW_BAR',
  'DODW_MP40',
  'DODW_HANDGRENADE',
  'DODW_STICKGRENADE',
  'DODW_STICKGRENADE_EX',
  'DODW_HANDGRENADE_EX',
  'DODW_MG42',
  'DODW_30_CAL',
  'DODW_SPADE',
  'DODW_M1_CARBINE',
  'DODW_MG34',
  'DODW_GREASEGUN',
  'DODW_FG42',
  'DODW_K43',
  'DODW_ENFIELD',
  'DODW_STEN',
  'DODW_BREN',
  'DODW_WEBLEY',
  'DODW_BAZOOKA',
  'DODW_PANZERSCHRECK',
  'DODW_PIAT',
  'DODW_SCOPED_FG42',
  'DODW_FOLDING_CARBINE',
  'DODW_KAR_BAYONET',
  'DODW_SCOPED_ENFIELD',
  'DODW_MILLS_BOMB',
  'DODW_BRITKNIFE',
  'DODW_GARAND_BUTT',
  'DODW_ENFIELD_BAYONET',
  'DODW_MORTAR',
  'DODW_K43_BUTT'
] as const;

type DoDWeapon = typeof dodWeapons[number];

function weaponIndexToName(weaponIndex: number): DoDWeapon {
  return dodWeapons[weaponIndex];
}

main(process.argv[2]).catch(console.error);
