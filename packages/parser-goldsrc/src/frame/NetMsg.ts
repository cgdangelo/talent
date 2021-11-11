import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { option as O } from "fp-ts";
import { flow, pipe } from "fp-ts/lib/function";
import { stream } from "parser-ts/lib/Stream";
import type { NetMsgInfo } from "./NetMsgInfo";
import { netMsgInfo } from "./NetMsgInfo";

export type NetMsg = {
  readonly info: NetMsgInfo;
  readonly incomingSequence: number;
  readonly incomingAcknowledged: number;
  readonly incomingReliableAcknowledged: number;
  readonly incomingReliableSequence: number;
  readonly outgoingSequence: number;
  readonly reliableSequence: number;
  readonly lastReliableSequence: number;
  readonly msgLength: number;
  readonly msg: unknown;
};

export type NetMsgFrameType = "Start" | "Normal" | number;

export const netMsgFrameType = (a: number): NetMsgFrameType => {
  switch (a) {
    case 0:
      return "Start";
    case 1:
      return "Normal";
    default:
      return a;
  }
};

const msgLength: B.BufferParser<number> = P.expected(
  pipe(
    B.int32_le,
    P.filter((a) => a > 0 && a < 65_536)
  ),
  "[0, 65_536]"
);

const msg: (msgLength: number) => B.BufferParser<unknown> = (msgLength) =>
  pipe(
    P.take<number>(msgLength),
    P.map((a) => a as unknown as Buffer),
    P.chain(messages)
  );

export const netMsg: B.BufferParser<NetMsg> = pipe(
  P.struct({
    info: netMsgInfo,
    incomingSequence: B.int32_le,
    incomingAcknowledged: B.int32_le,
    incomingReliableAcknowledged: B.int32_le,
    incomingReliableSequence: B.int32_le,
    outgoingSequence: B.int32_le,
    reliableSequence: B.int32_le,
    lastReliableSequence: B.int32_le,
    msgLength,
  }),

  P.chain((a) =>
    pipe(
      msg(a.msgLength),
      P.map((msg) => ({ ...a, msg }))
    )
  )
);

const messages: (messageBuffer: Buffer) => B.BufferParser<unknown> =
  (messageBuffer) => () =>
    pipe(
      stream(messageBuffer as unknown as number[]),

      P.manyTill(
        pipe(
          P.logPositions(message),

          // HACK For debugging
          P.map((a) => {
            console.log();
            console.log();
            console.log();

            return a;
          })
        ),
        P.eof()
      )
    );

// TODO This needs to be moved to its own module.
const message: B.BufferParser<unknown> = pipe(
  B.uint8_le,

  P.chain((messageId): B.BufferParser<unknown> => {
    console.log(
      `Message (${messageId}): ${
        Message[messageId] ??
        (messageId >= 64 ? "Custom message" : "Unknown message")
      }`
    );

    switch (messageId) {
      case Message.SVC_BAD:
        return P.fail();

      case Message.SVC_PRINT:
        return B.ztstr;

      case Message.SVC_SERVERINFO:
        return pipe(
          P.struct({
            protocol: B.int32_le,
            spawnCount: B.int32_le,
            mapChecksum: B.int32_le,
            clientDllHash: P.take(16),
            maxPlayers: B.uint8_le,
            playerIndex: B.uint8_le,
            isDeathmatch: B.uint8_le,
            gameDir: B.ztstr,
            hostname: B.ztstr,
            mapFileName: B.ztstr,
            mapCycle: B.ztstr,
          }),

          P.chainFirst(() => P.skip(1))
        );

      case Message.SVC_FILETXFERFAILED:
        return B.ztstr;

      case Message.SVC_SENDEXTRAINFO:
        return P.struct({
          fallbackDir: B.ztstr,
          canCheat: B.uint8_le,
        });

      default:
        console.log(`Unhandled message: id=${messageId}`);

        return pipe(
          messageId,
          O.fromPredicate((a) => a >= 64),
          O.chain(
            flow(
              // TODO No idea where this is going to live
              (a) => new Map<Message, { size?: number }>().get(a),
              O.fromNullable
            )
          ),
          O.chain(flow((a) => a.size, O.fromNullable)),
          O.chain(O.fromPredicate((a) => a > -1)),
          O.map((a) => P.of<number, number>(a)),
          O.alt(() => O.some(B.uint8_le)),
          O.map(P.chain((a) => P.skip<number>(a))),
          O.getOrElse(() => P.fail())
        );
    }
  })
);

enum Message {
  SVC_BAD = 0,
  SVC_NOP = 1,
  SVC_DISCONNECT = 2,
  SVC_EVENT = 3,
  SVC_VERSION = 4,
  SVC_SETVIEW = 5,
  SVC_SOUND = 6,
  SVC_TIME = 7,
  SVC_PRINT = 8,
  SVC_STUFFTEXT = 9,
  SVC_SETANGLE = 10,
  SVC_SERVERINFO = 11,
  SVC_LIGHTSTYLE = 12,
  SVC_UPDATEUSERINFO = 13,
  SVC_DELTADESCRIPTION = 14,
  SVC_CLIENTDATA = 15,
  SVC_STOPSOUND = 16,
  SVC_PINGS = 17,
  SVC_PARTICLE = 18,
  SVC_DAMAGE = 19,
  SVC_SPAWNSTATIC = 20,
  SVC_EVENT_RELIABLE = 21,
  SVC_SPAWNBASELINE = 22,
  SVC_TEMPENTITY = 23,
  SVC_SETPAUSE = 24,
  SVC_SIGNONNUM = 25,
  SVC_CENTERPRINT = 26,
  SVC_KILLEDMONSTER = 27,
  SVC_FOUNDSECRET = 28,
  SVC_SPAWNSTATICSOUND = 29,
  SVC_INTERMISSION = 30,
  SVC_FINALE = 31,
  SVC_CDTRACK = 32,
  SVC_RESTORE = 33,
  SVC_CUTSCENE = 34,
  SVC_WEAPONANIM = 35,
  SVC_DECALNAME = 36,
  SVC_ROOMTYPE = 37,
  SVC_ADDANGLE = 38,
  SVC_NEWUSERMSG = 39,
  SVC_PACKETENTITIES = 40,
  SVC_DELTAPACKETENTITIES = 41,
  SVC_CHOKE = 42,
  SVC_RESOURCELIST = 43,
  SVC_NEWMOVEVARS = 44,
  SVC_RESOURCEREQUEST = 45,
  SVC_CUSTOMIZATION = 46,
  SVC_CROSSHAIRANGLE = 47,
  SVC_SOUNDFADE = 48,
  SVC_FILETXFERFAILED = 49,
  SVC_HLTV = 50,
  SVC_DIRECTOR = 51,
  SVC_VOICEINIT = 52,
  SVC_VOICEDATA = 53,
  SVC_SENDEXTRAINFO = 54,
  SVC_TIMESCALE = 55,
  SVC_RESOURCELOCATION = 56,
  SVC_SENDCVARVALUE = 57,
  SVC_SENDCVARVALUE2 = 58,
}
