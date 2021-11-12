import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { success } from "@talent/parser/lib/ParseResult";
import { option as O } from "fp-ts";
import { sequenceT } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";
import { stream } from "parser-ts/lib/Stream";
import { point } from "../../Point";
import { moveVars } from "../MoveVars";

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

      // TODO Can remove SVC_NOP, deprecated messages, but NOT messages that
      // have no arguments.
      // P.filter((a) => a !== null),

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
      // TODO The provided angles need to be scaled by (65536 / 360), but
      // hlviewer does not?
      return pipe(
        P.manyN(
          pipe(
            B.int16_le,
            P.map((a) => a * (65536 / 360))
          ),
          3
        ),
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
      return P.fail();

    case Message.SVC_SPAWNBASELINE: // 22
      return P.fail();

    case Message.SVC_TEMPENTITY: // 23
      // TODO Doable, just takes a lot of doing
      return P.fail();

    case Message.SVC_SETPAUSE: // 24
      return P.struct({ isPaused: B.int8_le });

    case Message.SVC_SIGNONNUM: // 25
      return P.struct({ sign: B.int8_le });

    case Message.SVC_CENTERPRINT: // 26
      return P.struct({ message: B.ztstr });

    // Deprecated
    case Message.SVC_KILLEDMONSTER: // 27
      return P.of(null);

    // Deprecated. Probably old Q2 message?
    case Message.SVC_FOUNDSECRET: // 28
      return P.of(null);

    case Message.SVC_SPAWNSTATICSOUND: // 29
      return P.struct({
        // TODO hlviewer scales by 8 here?
        origin: point,

        soundIndex: B.uint16_le,
        volume: pipe(
          B.int8_le,
          P.map((a) => a / 255)
        ),
        attenuation: pipe(
          B.int8_le,
          P.map((a) => a / 64)
        ),
        entityIndex: B.int16_le,

        // TODO Find all the SND_, VOL_ ATTN_, PITCH_ flags?
        // https://forums.alliedmods.net/showthread.php?t=234965
        // https://forums.alliedmods.net/showpost.php?p=2455441&postcount=8
        // https://github.com/baso88/SC_AngelScript/wiki/SoundSystem
        flags: B.int8_le,
      });

    case Message.SVC_INTERMISSION: // 30
      return P.of(null);

    case Message.SVC_FINALE: // 31
      return P.struct({ text: B.ztstr });

    case Message.SVC_CDTRACK: // 32
      return P.struct({
        track: pipe(
          // TODO hlviewer has signed byte, but...
          B.int8_le,
          // https://wiki.alliedmods.net/Half-Life_1_Engine_Messages#SVC_CDTRACK
          // ...this should only be [1, 30] ?
          P.filter((a) => a > 0 && a < 31)
        ),
        loopTrack: B.int8_le,
      });

    case Message.SVC_RESTORE: // 33
      return pipe(
        P.struct({
          saveName: B.ztstr,
          mapCount: B.uint8_le,
        }),
        P.chain((a) =>
          pipe(
            P.manyN(B.ztstr, a.mapCount),
            P.map((mapNames) => ({ ...a, mapNames }))
          )
        )
      );

    case Message.SVC_CUTSCENE: // 34
      return P.struct({ text: B.ztstr });

    case Message.SVC_WEAPONANIM: // 35
      return P.struct({
        sequenceNumber: B.int8_le,
        weaponModelBodyGroup: B.int8_le,
      });

    case Message.SVC_DECALNAME: // 36
      return P.struct({ positionIndex: B.uint8_le, decalName: B.ztstr });

    case Message.SVC_ROOMTYPE: // 37
      return pipe(
        B.uint16_le,
        P.map((typeName) =>
          pipe(
            () => {
              switch (typeName) {
                case 0:
                  return "Normal";
                case 1:
                  return "Generic";
                case 2:
                  return "Metal Small";
                case 3:
                  return "Metal Medium";
                case 4:
                  return "Metal Large";
                case 5:
                  return "Tunnel Small";
                case 6:
                  return "Tunnel Medium";
                case 7:
                  return "Tunnel Large";
                case 8:
                  return "Chamber Small";
                case 9:
                  return "Chamber Medium";
                case 10:
                  return "Chamber Large";
                case 11:
                  return "Bright Small";
                case 12:
                  return "Bright Medium";
                case 13:
                  return "Bright Large";
                case 14:
                  return "Water 1";
                case 15:
                  return "Water 2";
                case 16:
                  return "Water 3";
                case 17:
                  return "Concrete Small";
                case 18:
                  return "Concrete Medium";
                case 19:
                  return "Concrete Large";
                case 20:
                  return "Big 1";
                case 21:
                  return "Big 2";
                case 22:
                  return "Big 3";
                case 23:
                  return "Cavern Small";
                case 24:
                  return "Cavern Medium";
                case 25:
                  return "Cavern Large";
                case 26:
                  return "Weirdo 1";
                case 27:
                  return "Weirdo 2";
                case 28:
                  return "Weirdo 3 ";
                default:
                  return "Unknown";
              }
            },

            (type) => ({ type, typeName })
          )
        )
      );

    case Message.SVC_ADDANGLE: // 38
      return P.struct({
        angleToAdd: pipe(
          B.int16_le,
          P.map((a) => a / (65536 / 360))
        ),
      });

    case Message.SVC_NEWUSERMSG: // 39
      return P.struct({
        index: B.uint8_le,
        size: B.uint8_le,

        // TODO "Name can be represented as an array of 4 "longs"." ???
        // https://wiki.alliedmods.net/Half-Life_1_Engine_Messages#SVC_NEWUSERMSG
        name: B.ztstr_padded(16),
      });

    case Message.SVC_PACKETENTITIES: // 40
      return P.fail();

    case Message.SVC_DELTAPACKETENTITIES: // 41
      return P.fail();

    case Message.SVC_CHOKE: // 42
      return P.of(null);

    case Message.SVC_RESOURCELIST: // 43
      return P.fail();

    case Message.SVC_NEWMOVEVARS: // 44
      return pipe(
        moveVars,
        P.chain((a) =>
          pipe(
            B.ztstr,
            P.map((skyName) => ({ ...a, skyName }))
          )
        )
      );

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
      // TODO hlviewer does not scale these. Find out what "engine call" means
      // here: https://wiki.alliedmods.net/Half-Life_1_Engine_Messages#SVC_CROSSHAIRANGLE
      return pipe(
        sequenceT(P.Applicative)(
          pipe(
            B.int16_le
            // P.map((a) => a / 5)
          ),

          pipe(
            B.int16_le
            // P.map((a) => a / 5)
          )
        ),

        P.map(([pitch, yaw]) => ({ pitch, yaw }))
      );

    case Message.SVC_SOUNDFADE: // 48
      return P.struct({
        initialPercent: B.uint8_le,
        holdTime: B.uint8_le,
        fadeOutTime: B.uint8_le,
        fadeInTime: B.uint8_le,
      });

    case Message.SVC_FILETXFERFAILED: // 49
      return P.struct({ filename: B.ztstr });

    case Message.SVC_HLTV: // 50
      // #define HLTV_ACTIVE	0	// tells client that he's an spectator and will get director commands
      // #define HLTV_STATUS	1	// send status infos about proxy
      // #define HLTV_LISTEN	2	// tell client to listen to a multicast stream
      return pipe(
        B.uint8_le,
        P.map((mode) =>
          pipe(
            () => {
              switch (mode) {
                case 0:
                  return "HLTV_ACTIVE";
                case 1:
                  return "HLTV_STATUS";
                case 2:
                  return "HLTV_LISTEN";
                default:
                  return "Unknown";
              }
            },
            (modeName) => ({ mode, modeName })
          )
        )
      );

    case Message.SVC_DIRECTOR: // 51
      return pipe(
        B.uint8_le,

        P.chain((length) =>
          P.struct({ flag: B.uint8_le, message: B.ztstr_padded(length) })
        )
      );

    case Message.SVC_VOICEINIT: // 52
      return P.struct({
        codecName: B.ztstr,
        quality: B.int8_le,
      });

    case Message.SVC_VOICEDATA: // 53
      return pipe(
        P.struct({ playerIndex: B.uint8_le, size: B.uint16_le }),
        P.chain((a) =>
          pipe(
            P.manyN(B.uint8_le, a.size),
            P.map((data) => ({ ...a, data }))
          )
        )
      );

    case Message.SVC_SENDEXTRAINFO: // 54
      return P.struct({ fallbackDir: B.ztstr, canCheat: B.uint8_le });

    case Message.SVC_TIMESCALE: // 55
      return P.struct({ timeScale: B.float32_le });

    case Message.SVC_RESOURCELOCATION: // 56
      return P.struct({ sv_downloadurl: B.ztstr });

    case Message.SVC_SENDCVARVALUE: // 57
      // Deprecated
      return P.struct({ name: B.ztstr });

    case Message.SVC_SENDCVARVALUE2: // 58
      return P.struct({ requestId: B.uint32_le, name: B.ztstr });

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
