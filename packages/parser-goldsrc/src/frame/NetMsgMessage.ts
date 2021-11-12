import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { success } from "@talent/parser/lib/ParseResult";
import { option as O } from "fp-ts";
import { flow, pipe } from "fp-ts/lib/function";
import { stream } from "parser-ts/lib/Stream";

// TODO Seriously need to figure out better names for these things. There's too
// many "messages".

type MessageData = unknown;

export const messages: (messageBuffer: Buffer) => B.BufferParser<MessageData> =
  (messageBuffer) => (i) =>
    pipe(
      stream(messageBuffer as unknown as number[]),

      pipe(
        P.many(message),

        P.chain((parsedMessages) => () => success(parsedMessages, i, i))
      )
    );

// TODO This needs to be moved to its own module.
const message: B.BufferParser<unknown> = pipe(
  B.uint8_le,

  P.chain((messageId) =>
    pipe(
      parseMessage(messageId),

      // Removes SVC_NOP
      P.filter((a) => a !== null),

      P.map((fields) => ({ type: Message[messageId], fields }))
    )
  )
);

const parseMessage: (messageId: Message) => B.BufferParser<unknown> = (
  messageId
) => {
  switch (messageId) {
    case Message.SVC_NOP: // 1
      return P.succeed(null);

    case Message.SVC_TIME: // 7
      return P.struct({ time: B.float32_le });

    case Message.SVC_PRINT: // 8
      return P.struct({ printText: B.ztstr });

    case Message.SVC_STUFFTEXT: // 9
      return P.struct({ command: B.ztstr });

    case Message.SVC_SERVERINFO: // 11
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

    case Message.SVC_UPDATEUSERINFO: // 13
      return P.struct({
        clientIndex: B.uint8_le,
        clientUserId: B.int32_le,
        clientUserInfo: B.ztstr,
        clientCdKeyHash: P.take(16),
      });

    case Message.SVC_WEAPONANIM: // 35
      return P.struct({
        sequenceNumber: B.uint8_le,
        weaponModelBodyGroup: B.uint8_le,
      });

    case Message.SVC_RESOURCEREQUEST: // 45
      return pipe(
        P.struct({ spawnCount: B.uint32_le }),
        P.chainFirst(() => B.uint32_le)
      );

    case Message.SVC_CUSTOMIZATION: // 46
      return pipe(
        P.struct({
          playerIndex: B.uint8_le,
          type: B.uint8_le,
          name: B.ztstr,
          index: B.int_le(8),
          downloadSize: B.int32_le,
          flags: B.uint8_le,
        }),

        P.chain((a) =>
          pipe(
            a.flags,
            O.fromPredicate((flags) => (flags & 4) !== 0), // RES_CUSTOM
            O.map(() => P.take<number>(4)),
            O.getOrElse(() => P.fail()),
            P.map((md5Hash) => ({ ...a, md5Hash })),
            P.alt(() => P.of(a))
          )
        )
      );

    case Message.SVC_FILETXFERFAILED: // 49
      return P.struct({ filename: B.ztstr });

    case Message.SVC_SENDEXTRAINFO: // 54
      return P.struct({ fallbackDir: B.ztstr, canCheat: B.uint8_le });

    case Message.SVC_RESOURCELOCATION: // 56
      return P.struct({ sv_downloadurl: B.ztstr });

    default:
      // Fail by default for now so we can see more messages
      return P.fail();

      return pipe(
        messageId,

        // Messages above 64 are custom messages
        O.fromPredicate((a) => a >= 64),

        // Custom message should have been stored previously,
        // potentially with bit length
        O.chain(
          flow(
            // TODO No idea where this is going to live
            (a) => new Map<Message, { size?: number }>().get(a),
            O.fromNullable
          )
        ),
        O.chain(flow((a) => a.size, O.fromNullable)),
        O.chain(O.fromPredicate((a) => a > -1)),

        // Use the known bit length
        O.map((a) => P.of<number, number>(a)),
        // or read it from the next byte
        O.alt(() => O.some(B.uint8_le)),

        // Skip whatever length we have or fail
        O.fold(P.fail, P.chain<number, number, void>(P.skip))
      );
  }
};

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
