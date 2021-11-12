import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { success } from "@talent/parser/lib/ParseResult";
import { option as O } from "fp-ts";
import { sequenceT } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";
import { stream } from "parser-ts/lib/Stream";
import { point } from "../../Point";

// TODO Engine messages should be typed
type EngineMsg = unknown;

export const engineMsgs: (messageBuffer: Buffer) => B.BufferParser<EngineMsg> =
  (messageBuffer) => (i) =>
    pipe(
      stream(messageBuffer as unknown as number[]),

      pipe(
        P.many(engineMsg),

        P.chain((parsedMessages) => () => success(parsedMessages, i, i))
      )
    );

const engineMsg: B.BufferParser<unknown> = pipe(
  B.uint8_le,

  P.chain((messageId) =>
    pipe(
      engineMsg_(messageId),

      // Removes SVC_NOP
      P.filter((a) => a !== null),

      P.map((fields) => ({ type: Message[messageId], fields }))
    )
  )
);

const engineMsg_: (messageId: Message) => B.BufferParser<unknown> = (
  messageId
) => {
  // TODO Replace with Option?
  switch (messageId) {
    case Message.SVC_BAD:
      // Should never see this message, so we can treat it as an exceptional
      // case?
      return P.cut(P.fail());

    // TODO Excise these into separate modules, or functions at least
    case Message.SVC_NOP: // 1
      return P.succeed(null);

    case Message.SVC_DISCONNECT: // 2
      return P.struct({ reason: B.ztstr });

    case Message.SVC_EVENT: // 3
      return P.fail();

    case Message.SVC_VERSION: // 4
      return P.struct({ protocolVersion: B.uint32_le });

    case Message.SVC_SETVIEW: // 5
      return P.struct({ entityIndex: B.int16_le });

    case Message.SVC_SOUND: // 6
      return P.fail();

    case Message.SVC_TIME: // 7
      return P.struct({ time: B.float32_le });

    case Message.SVC_PRINT: // 8
      return P.struct({ message: B.ztstr });

    case Message.SVC_STUFFTEXT: // 9
      return P.struct({ command: B.ztstr });

    case Message.SVC_SETANGLE: // 10
      // TODO The provided angles need to be scaled by (65536 / 360).
      return pipe(
        P.manyN(B.int16_le, 3),
        P.map(([pitch, yaw, roll]) => ({ pitch, yaw, roll }))
      );

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

    case Message.SVC_LIGHTSTYLE: // 12
      return P.struct({ index: B.uint8_le, lightInfo: B.ztstr }); // TODO Parse light info?

    case Message.SVC_UPDATEUSERINFO: // 13
      return P.struct({
        clientIndex: B.uint8_le,
        clientUserId: B.uint32_le,
        clientUserInfo: B.ztstr,
        clientCdKeyHash: P.take(16),
      });

    case Message.SVC_DELTADESCRIPTION: // 14
      return P.fail();

    case Message.SVC_CLIENTDATA: // 15
      return P.fail();

    case Message.SVC_STOPSOUND: // 16
      return P.struct({ entityIndex: B.int16_le });

    case Message.SVC_PINGS: // 17
      return P.fail();

    case Message.SVC_PARTICLE: // 18
      return P.struct({
        origin: point,

        // TODO AlliedMods says 1/16, hlviewer has 1/8?
        direction: point,

        count: B.uint8_le,
        color: B.uint8_le,
      });

    // Deprecated
    case Message.SVC_DAMAGE: // 19
      return P.of(null);

    case Message.SVC_SPAWNSTATIC: // 20
      return pipe(
        P.struct({
          modelIndex: B.int16_le,
          sequence: B.int8_le,
          frame: B.int8_le,
          colorMap: B.int16_le,
          skin: B.int8_le,
          origin: point,
        }),

        // valve who did this i just wanna talk
        P.chain((a) =>
          pipe(
            // Origin and angle x-, y-, and z-coordinates alternate, and need
            // to be scaled.
            [
              pipe(
                B.int16_le,
                P.map((a) => a / 8)
              ),

              pipe(
                B.int8_le,
                P.map((a) => a * (360 / 256))
              ),
            ] as const,

            ([origin, angle]) =>
              sequenceT(P.Applicative)(
                origin,
                angle,
                origin,
                angle,
                origin,
                angle
              ),

            P.map(([originX, angleX, originY, angleY, originZ, angleZ]) => ({
              ...a,
              origin: { x: originX, y: originY, z: originZ },
              angle: { x: angleX, y: angleY, z: angleZ },
            }))
          )
        ),

        P.chain((a) =>
          pipe(
            P.struct({ renderMode: B.int8_le }),
            P.map((b) => ({ ...a, ...b }))
          )
        ),

        P.chain((a) =>
          pipe(
            a.renderMode,
            O.fromPredicate((a) => a !== 0),
            O.map(() =>
              pipe(
                P.struct({
                  renderColor: pipe(
                    sequenceT(P.Applicative)(
                      B.uint8_le,
                      B.uint8_le,
                      B.uint8_le
                    ),
                    P.map(([r, g, b]) => ({ r, g, b }))
                  ),
                  renderFx: B.uint8_le,
                }),
                P.map((b) => ({ ...a, ...b }))
              )
            ),
            O.getOrElse(() => P.fail()),
            P.alt(() => P.of(a))
          )
        )
      );

    case Message.SVC_EVENT_RELIABLE: // 21
    case Message.SVC_SPAWNBASELINE: // 22
    case Message.SVC_TEMPENTITY: // 23
    case Message.SVC_SETPAUSE: // 24
    case Message.SVC_SIGNONNUM: // 25
    case Message.SVC_CENTERPRINT: // 26
    case Message.SVC_KILLEDMONSTER: // 27
    case Message.SVC_FOUNDSECRET: // 28
    case Message.SVC_SPAWNSTATICSOUND: // 29
    case Message.SVC_INTERMISSION: // 30
    case Message.SVC_FINALE: // 31
    case Message.SVC_CDTRACK: // 32
    case Message.SVC_RESTORE: // 33
    case Message.SVC_CUTSCENE: // 34
    case Message.SVC_WEAPONANIM: // 35
      return P.struct({
        sequenceNumber: B.int8_le,
        weaponModelBodyGroup: B.int8_le,
      });
    case Message.SVC_DECALNAME: // 36
    case Message.SVC_ROOMTYPE: // 37
    case Message.SVC_ADDANGLE: // 38
    case Message.SVC_NEWUSERMSG: // 39
    case Message.SVC_PACKETENTITIES: // 40
    case Message.SVC_DELTAPACKETENTITIES: // 41
    case Message.SVC_CHOKE: // 42
    case Message.SVC_RESOURCELIST: // 43
    case Message.SVC_NEWMOVEVARS: // 44
    case Message.SVC_RESOURCEREQUEST: // 45
      return pipe(
        P.struct({ spawnCount: B.int32_le }),
        P.chainFirst(() => P.skip(4))
      );

    case Message.SVC_CUSTOMIZATION: // 46
      return pipe(
        P.struct({
          playerIndex: B.uint8_le,
          type: B.uint8_le,
          name: B.ztstr,
          index: B.uint16_le,
          downloadSize: B.uint32_le,
          flags: B.uint8_le,
        }),

        P.chain((a) =>
          pipe(
            a.flags,
            O.fromPredicate((flags) => (flags & 4) !== 0), // RES_CUSTOM
            O.map(() => P.manyN(B.int8_le, 4)),
            O.getOrElse(() => P.fail()),
            P.map((md5Hash) => ({ ...a, md5Hash })),
            P.alt(() => P.of(a))
          )
        )
      );

    case Message.SVC_CROSSHAIRANGLE: // 47
    case Message.SVC_SOUNDFADE: // 48
    case Message.SVC_FILETXFERFAILED: // 49
      return P.struct({ filename: B.ztstr });

    case Message.SVC_HLTV: // 50
    case Message.SVC_DIRECTOR: // 51
    case Message.SVC_VOICEINIT: // 52
    case Message.SVC_VOICEDATA: // 53

    case Message.SVC_SENDEXTRAINFO: // 54
      return P.struct({ fallbackDir: B.ztstr, canCheat: B.uint8_le });

    case Message.SVC_TIMESCALE: // 55

    case Message.SVC_RESOURCELOCATION: // 56
      return P.struct({ sv_downloadurl: B.ztstr });

    case Message.SVC_SENDCVARVALUE: // 57
    case Message.SVC_SENDCVARVALUE2: // 58

    default:
      // TODO Can keep for when custom message parsing works
      // return pipe(
      //   messageId,

      //   // Messages above 64 are custom messages
      //   O.fromPredicate((a) => a >= 64),

      //   // Custom message should have been stored previously,
      //   // potentially with bit length
      //   O.chain(
      //     flow(
      //       // TODO No idea where this is going to live
      //       (a) => new Map<Message, { size?: number }>().get(a),
      //       O.fromNullable
      //     )
      //   ),
      //   O.chain(flow((a) => a.size, O.fromNullable)),
      //   O.chain(O.fromPredicate((a) => a > -1)),

      //   // Use the known bit length
      //   O.map((a) => P.of<number, number>(a)),
      //   // or read it from the next byte
      //   O.alt(() => O.some(B.uint8_le)),

      //   // Skip whatever length we have or fail
      //   O.fold(P.fail, P.chain<number, number, void>(P.skip))
      // );

      // HACK For now, fail by default for now so we can see more messages
      return P.fail();
  }
};

export enum Message {
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
