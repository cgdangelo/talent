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
  mergeScan,
  Observable,
  of,
  reduce,
  scan,
  takeUntil,
  withLatestFrom,
  zip
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

  const demoStart$: Observable<void> = fromEvent(demoEvents, 'demo:start');

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

          // TODO case 2

          case 3:
            return 'win-allies' as const;
          case 4:
            return 'win-axis' as const;
          case 5:
            return 'draw' as const;

          default:
            throw new Error(
              `Can't resolve round state {${roundStateIndex}} to construct IRoundStateChangeEvent.`
            );
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
        const timerLength = `{${userMessage.data.readInt8(0)}}`;

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

        return `🔴 | ${frameTime} | Round WIN: ${winningTeam}.`;
      })
    )
  );

  const roundDurationMetrics$ = roundWin$.pipe(
    reduce((acc, cur, index) => (acc * index + cur.roundDurationS) / (index + 1), 0),
    map((meanRoundDurationS) => `Mean round duration: ${meanRoundDurationS.toFixed(3)}.`)
  );

  const players$: Observable<Partial<Record<number, { playerName: string; teamName?: DoDTeam }>>> =
    engineMessage$.pipe(
      mergeMap((engineMessage) => (engineMessage.name === 'SVC_UPDATEUSERINFO' ? of(engineMessage) : EMPTY)),
      filter((updateUserInfo) => updateUserInfo.fields.clientUserInfo['*hltv'] !== '1'),
      scan((acc, cur) => {
        const clientIndex = cur.fields.clientIndex;
        const playerName = cur.fields.clientUserInfo.name;
        const teamName = cur.fields.clientUserInfo.team as DoDTeam;

        return { ...acc, [clientIndex]: { playerName, teamName } };
      })
    );

  const frag$: Observable<IFragEvent> = userMessage$.pipe(
    filter((userMessage) => userMessage.name === 'DeathMsg'),
    map((userMessage) => {
      const killerClientIndex = userMessage.data.readInt8(0) - 1;
      const victimClientIndex = userMessage.data.readInt8(1) - 1;
      const weaponIndex = userMessage.data.readInt8(2);

      return {
        timeS: userMessage.parentFrame.header.time,
        killerClientIndex: killerClientIndex === -1 ? victimClientIndex : killerClientIndex,
        victimClientIndex,
        weaponIndex
      };
    }),
    withLatestFrom(players$),
    map(([frag, players]) => {
      const killerName = players[frag.killerClientIndex]?.playerName;
      const victimName = players[frag.victimClientIndex]?.playerName;

      if (!killerName) {
        throw new Error(`Can't find killer {${frag.killerClientIndex}} to construct IFragEvent.`);
      }

      if (!victimName) {
        throw new Error(`Can't find victim {${frag.victimClientIndex}} to construct IFragEvent.`);
      }

      const isTeamkill =
        players[frag.killerClientIndex]?.teamName === players[frag.victimClientIndex]?.teamName;
      const weaponName = weaponIndexToName(frag.weaponIndex);

      return { timeS: frag.timeS, killerName, victimName, isTeamkill, weaponName };
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
      const teamName = teamIndexToName(teamIndex);

      return { timeS: userMessage.parentFrame.header.time, teamName, score };
    })
  );

  const teamScores$: Observable<ITeamScoresChangeEvent> = teamScore$.pipe(
    mergeScan(
      (acc, cur) =>
        acc.scoreState[cur.teamName] === cur.score
          ? EMPTY
          : of({ timeS: cur.timeS, scoreState: { ...acc.scoreState, [cur.teamName]: cur.score } }),
      { scoreState: {} } as { timeS: number; scoreState: Record<DoDTeam, number> }
    )
  );

  const teamScoreFeed$ = merge(
    teamScores$,

    demoEnd$.pipe(
      withLatestFrom(teamScores$),
      map(([, teamScores]) => teamScores)
    )
  ).pipe(
    map((teamScores) => {
      const frameTime = `t=${teamScores.timeS.toFixed(3)}s`.padEnd(12);
      const scoreState = `${JSON.stringify(teamScores.scoreState)}`;

      return `📈 | ${frameTime} | Team scores: ${scoreState}.`;
    })
  );

  const objectiveCapture$: Observable<IObjectiveCaptureEvent> = userMessage$.pipe(
    filter((userMessage) => userMessage.name === 'CapMsg'),
    withLatestFrom(players$),
    map(([userMessage, players]) => {
      const clientIndex = userMessage.data.readInt8(0) - 1;
      const objectiveName = new TextDecoder().decode(
        userMessage.data.subarray(1, userMessage.data.length - 2)
      );
      const teamName = teamIndexToName(userMessage.data.readInt8(userMessage.data.length - 1));

      const playerName = players[clientIndex]?.playerName;

      if (!playerName) {
        throw new Error(`Can't find player {${clientIndex}} to construct IObjectiveCaptureEvent.`);
      }

      if (teamName !== players[clientIndex]?.teamName) {
        throw new Error(
          `CapMsg team name {${teamName}} does not match SVC_UPDATEUSERINFO team name {${players[clientIndex]?.teamName}}.`
        );
      }

      return { timeS: userMessage.parentFrame.header.time, playerName, objectiveName, teamName };
    })
  );

  const objectiveFeed$ = objectiveCapture$.pipe(
    map((objectiveCapture) => {
      const frameTime = `t=${objectiveCapture.timeS.toFixed(3)}s`.padEnd(12);
      const playerName = `{${objectiveCapture.playerName}}`;
      const objectiveName = `{${objectiveCapture.objectiveName}}`;
      const teamName = `{${objectiveCapture.teamName}}`;

      return `🚩 | ${frameTime} | ${playerName} captured objective ${objectiveName} for ${teamName}.`;
    })
  );

  const sayText$ = userMessage$.pipe(
    filter((userMessage) => userMessage.name === 'SayText'),
    map((userMessage) => {
      // const senderClientIndex = userMessage.data.readInt8(0) - 1; // 0 = rcon
      const destinationChannel = userMessage.data.readInt8(1); // 1 = rcon say, 2 = player text
      const messageText = new TextDecoder().decode(userMessage.data.subarray(2, userMessage.data.length - 2)); // remove newline and null bytes

      return {
        timeS: userMessage.parentFrame.header.time,
        destinationChannel,
        messageText,
        isTeamChat: messageText.startsWith('(TEAM) ')
      };
    })
  );

  const chatFeed$ = sayText$.pipe(
    map((sayText) => {
      const frameTime = `t=${sayText.timeS.toFixed(3)}s`.padEnd(12);

      return `🗣️  | ${frameTime} | ${sayText.messageText}`;
    })
  );

  merge(chatFeed$, roundFeed$, killFeed$, objectiveFeed$, teamScoreFeed$, roundDurationMetrics$).subscribe({
    next: console.log,
    error: console.error
  });

  // Parser metrics

  const parsingFrameRate$ = demoStart$.pipe(
    map(() => Date.now()),
    mergeMap((demoParseStart) =>
      frame$.pipe(
        map((frame) => {
          const frameTime = frame.header.time;
          const clockTime = (Date.now() - demoParseStart) / 1e3;

          return frameTime / clockTime;
        })
      )
    ),
    takeUntil(demoEnd$)
  );

  const parsingExecutionTimeS$ = zip([
    demoStart$.pipe(map(() => Date.now())),
    demoEnd$.pipe(map(() => Date.now()))
  ]).pipe(map(([demoParseStart, demoParseEnd]) => (demoParseEnd - demoParseStart) / 1e3));

  merge(
    parsingFrameRate$.pipe(
      reduce((acc, cur, index) => (acc * index + cur) / (index + 1)),
      map((fpsRatio) => {
        const parseRate = `{${fpsRatio.toFixed(3)}x}`;

        return `🏥 | Mean parser speed: ${parseRate}.`;
      })
    ),

    parsingExecutionTimeS$.pipe(
      map((executionTime) => {
        const time = `{${executionTime.toFixed(3)}s}`;
        return `🏥 | Parser execution time: ${time}.`;
      })
    )
  ).subscribe({ next: console.log, error: console.error });

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
    | 'draw' // Round draw.
    | `win-${'allies' | 'axis'}`; // Allies or axis team won the round.
}

/** Emitted when RoundState message is parsed with a win state for either team. */
interface IRoundWinEvent {
  /** Time, in seconds, since beginning of demo. */
  timeS: number;

  /** Name of the team that won the round. */
  team: DoDTeam;

  /** Time, in seconds, between the round start event and the round win event. */
  roundDurationS: number;
}

/** Emitted when DeathMsg message is parsed. */
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

/** Emitted when TeamScore message is parsed.  */
interface ITeamScoreEvent {
  /** Time, in seconds, since beginning of demo. */
  timeS: number;

  /** Team's name. */
  teamName: DoDTeam;

  /** Team's score. */
  score: number;
}

/** Emitted when TeamScore message is parsed and changes a team's score. */
interface ITeamScoresChangeEvent {
  /** Time, in seconds, since beginning of demo. */
  timeS: number;

  /** Map of team name to team score. */
  scoreState: Record<DoDTeam, number>;
}

/** Emitted when CapMsg message is parsed. */
interface IObjectiveCaptureEvent {
  /** Time, in seconds, since beginning of demo. */
  timeS: number;

  /** Name of the player that captured the objective. */
  playerName: string;

  /** Name of the objective. */
  objectiveName: string;

  /** Name of the team that captured the objective. */
  teamName: DoDTeam;
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

type DoDWeapon = Exclude<typeof dodWeapons[number], undefined>;

function weaponIndexToName(weaponIndex: number): DoDWeapon | undefined {
  if (weaponIndex === 0) return undefined;

  const weaponName = dodWeapons[weaponIndex - 1];

  if (!weaponName) {
    throw new Error(`Can't resolve weapon ${weaponIndex}.`);
  }

  return weaponName;
}

// eslint-disable-next-line @rushstack/typedef-var
const dodTeams = ['allies', 'axis'] as const;

type DoDTeam = Exclude<typeof dodTeams[number], undefined>;

function teamIndexToName(teamIndex: number): DoDTeam {
  const teamName = dodTeams[teamIndex - 1];

  if (!teamName) {
    throw new Error(`Can't resolve team {${teamIndex}}.`);
  }

  return teamName;
}

main(process.argv[2]).catch(console.error);
