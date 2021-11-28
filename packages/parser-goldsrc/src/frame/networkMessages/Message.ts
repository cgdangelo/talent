import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";
import * as M from "./messages";
import { MessageType } from "./MessageType";

type Message =
  | void // TODO from parser failures?
  | M.Bad
  | M.Nop
  | M.Disconnect
  | M.Event
  | M.Version
  | M.SetView
  | M.Sound
  | M.Time
  | M.Print
  | M.StuffText
  | M.SetAngle
  | M.ServerInfo
  | M.LightStyle
  | M.UpdateUserInfo
  | M.DeltaDescription
  | M.ClientData
  | M.StopSound
  | M.Pings
  | M.Particle
  | M.Damage
  | M.SpawnStatic
  | M.EventReliable
  | M.SpawnBaseline
  | M.TempEntity
  | M.SetPause
  | M.SignOnNum
  | M.CenterPrint
  | M.KilledMonster
  | M.FoundSecret
  | M.SpawnStaticSound
  | M.Intermission
  | M.Finale
  | M.CDTrack
  | M.Restore
  | M.Cutscene
  | M.WeaponAnim
  | M.DecalName
  | M.RoomType
  | M.AddAngle
  | M.NewUserMsg
  | M.PacketEntities
  | M.DeltaPacketEntities
  | M.Choke
  | M.ResourceList
  | M.NewMoveVars
  | M.ResourceRequest
  | M.Customization
  | M.CrosshairAngle
  | M.SoundFade
  | M.FileTxferFailed
  | M.HLTV
  | M.Director
  | M.VoiceInit
  | M.VoiceData
  | M.SendExtraInfo
  | M.TimeScale
  | M.ResourceLocation
  | M.SendCvarValue
  | M.SendCvarValue2;

type MessageFrame = {
  // TODO move to parsers for union?
  readonly type: { readonly id: number; readonly name: string };
  readonly fields: Message;
};

export const messages: (
  messagesLength: number
) => B.BufferParser<readonly MessageFrame[]> = (messagesLength) => (i) =>
  pipe(
    i,

    pipe(
      P.manyTill(
        P.logPositions(message),

        pipe(
          P.withStart(P.of<number, void>(undefined)),
          P.filter(
            ([, { cursor: currentPosition }]) =>
              currentPosition === i.cursor + messagesLength
          )
        )
      ),

      P.alt(() =>
        pipe(
          P.of<number, readonly MessageFrame[]>([]),
          P.apFirst(P.seek(i.cursor + messagesLength))
        )
      )
    )
  );

const message: B.BufferParser<MessageFrame> = pipe(
  B.uint8_le,

  P.chain((messageId) =>
    pipe(
      message_(messageId),

      // TODO Can remove SVC_NOP, deprecated messages, but NOT messages that
      // have no arguments.
      // P.filter(() => messageId !== Message.SVC_NOP),

      P.map((fields) => ({
        type: { id: messageId, name: MessageType[messageId]! }, // TODO remove nonnull assertion
        fields,
      }))
    )
  )
);

const message_: (messageId: MessageType) => B.BufferParser<Message> = (
  messageId
) => {
  // TODO Replace with Option?
  switch (messageId) {
    case MessageType.SVC_BAD:
      return M.bad;

    case MessageType.SVC_NOP: // 1
      return M.nop;

    case MessageType.SVC_DISCONNECT: // 2
      return M.disconnect;

    case MessageType.SVC_EVENT: // 3
      return M.event;

    case MessageType.SVC_VERSION: // 4
      return M.version;

    case MessageType.SVC_SETVIEW: // 5
      return M.setView;

    case MessageType.SVC_SOUND: // 6
      return M.sound;

    case MessageType.SVC_TIME: // 7
      return M.time;

    case MessageType.SVC_PRINT: // 8
      return M.print;

    case MessageType.SVC_STUFFTEXT: // 9
      return M.stuffText;

    case MessageType.SVC_SETANGLE: // 10
      return M.setAngle;

    case MessageType.SVC_SERVERINFO: // 11
      return M.serverInfo;

    case MessageType.SVC_LIGHTSTYLE: // 12
      return M.lightStyle;

    case MessageType.SVC_UPDATEUSERINFO: // 13
      return M.updateUserInfo;

    case MessageType.SVC_DELTADESCRIPTION: // 14
      return M.deltaDescription;

    case MessageType.SVC_CLIENTDATA: // 15
      return M.clientData;

    case MessageType.SVC_STOPSOUND: // 16
      return M.stopSound;

    case MessageType.SVC_PINGS: // 17
      return M.pings;

    case MessageType.SVC_PARTICLE: // 18
      return M.particle;

    case MessageType.SVC_DAMAGE: // 19
      return M.damage;

    case MessageType.SVC_SPAWNSTATIC: // 20
      return M.spawnStatic;

    case MessageType.SVC_EVENT_RELIABLE: // 21
      return M.eventReliable;

    case MessageType.SVC_SPAWNBASELINE: // 22
      return M.spawnBaseline;

    case MessageType.SVC_TEMPENTITY: // 23
      return M.tempEntity;

    case MessageType.SVC_SETPAUSE: // 24
      return M.setPause;

    case MessageType.SVC_SIGNONNUM: // 25
      return M.signOnNum;

    case MessageType.SVC_CENTERPRINT: // 26
      return M.centerPrint;

    case MessageType.SVC_KILLEDMONSTER: // 27
      return M.killedMonster;

    case MessageType.SVC_FOUNDSECRET: // 28
      return M.foundSecret;

    case MessageType.SVC_SPAWNSTATICSOUND: // 29
      return M.spawnStaticSound;

    case MessageType.SVC_INTERMISSION: // 30
      return M.intermission;

    case MessageType.SVC_FINALE: // 31
      return M.finale;

    case MessageType.SVC_CDTRACK: // 32
      return M.cdTrack;

    case MessageType.SVC_RESTORE: // 33
      return M.restore;

    case MessageType.SVC_CUTSCENE: // 34
      return M.cutscene;

    case MessageType.SVC_WEAPONANIM: // 35
      return M.weaponAnim;

    case MessageType.SVC_DECALNAME: // 36
      return M.decalName;

    case MessageType.SVC_ROOMTYPE: // 37
      return M.roomType;

    case MessageType.SVC_ADDANGLE: // 38
      return M.addAngle;

    case MessageType.SVC_NEWUSERMSG: // 39
      return M.newUserMsg;

    case MessageType.SVC_PACKETENTITIES: // 40
      return M.packetEntities;

    case MessageType.SVC_DELTAPACKETENTITIES: // 41
      return M.deltaPacketEntities;

    case MessageType.SVC_CHOKE: // 42
      return M.choke;

    case MessageType.SVC_RESOURCELIST: // 43
      return M.resourceList;

    case MessageType.SVC_NEWMOVEVARS: // 44
      return M.newMoveVars;

    case MessageType.SVC_RESOURCEREQUEST: // 45
      return M.resourceRequest;

    case MessageType.SVC_CUSTOMIZATION: // 46
      return M.customization;

    case MessageType.SVC_CROSSHAIRANGLE: // 47
      return M.crosshairAngle;

    case MessageType.SVC_SOUNDFADE: // 48
      return M.soundFade;

    case MessageType.SVC_FILETXFERFAILED: // 49
      return M.fileTxferFailed;

    case MessageType.SVC_HLTV: // 50
      return M.hltv;

    case MessageType.SVC_DIRECTOR: // 51
      return M.director;

    case MessageType.SVC_VOICEINIT: // 52
      return M.voiceInit;

    case MessageType.SVC_VOICEDATA: // 53
      return M.voiceData;

    case MessageType.SVC_SENDEXTRAINFO: // 54
      return M.sendExtraInfo;

    case MessageType.SVC_TIMESCALE: // 55
      return M.timeScale;

    case MessageType.SVC_RESOURCELOCATION: // 56
      return M.resourceLocation;

    case MessageType.SVC_SENDCVARVALUE: // 57
      return M.sendCvarValue;

    case MessageType.SVC_SENDCVARVALUE2: // 58
      return M.sendCvarValue2;

    default:
      return messageId >= 64
        ? pipe(
            P.of<number, M.NewUserMsg | undefined>(
              M.customMessages.get(messageId)
            ),
            P.filter(
              (customMessage): customMessage is M.NewUserMsg =>
                customMessage != null && customMessage.size > -1
            ),
            P.map((customMessage) => customMessage.size),
            P.alt(() => B.uint8_le),
            P.chain((size) => P.skip<number>(size))
          )
        : P.fail();
  }
};
