import { statefulParser as SP } from "@talent/parser";
import { flow } from "fp-ts/lib/function";
import type { DemoStateParser } from "../../DemoState";
import * as M from "./engine";
import { MessageType } from "./MessageType";

export type EngineMessage =
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

const engineMessage_: (
  messageId: MessageType
) => DemoStateParser<EngineMessage> = (messageId) => {
  // TODO Replace with Option?
  switch (messageId) {
    case MessageType.SVC_BAD:
      return SP.lift(M.bad);

    case MessageType.SVC_NOP: // 1
      return SP.lift(M.nop);

    case MessageType.SVC_DISCONNECT: // 2
      return SP.lift(M.disconnect);

    case MessageType.SVC_EVENT: // 3
      return M.event;

    case MessageType.SVC_VERSION: // 4
      return SP.lift(M.version);

    case MessageType.SVC_SETVIEW: // 5
      return SP.lift(M.setView);

    case MessageType.SVC_SOUND: // 6
      return SP.lift(M.sound);

    case MessageType.SVC_TIME: // 7
      return SP.lift(M.time);

    case MessageType.SVC_PRINT: // 8
      return SP.lift(M.print);

    case MessageType.SVC_STUFFTEXT: // 9
      return SP.lift(M.stuffText);

    case MessageType.SVC_SETANGLE: // 10
      return SP.lift(M.setAngle);

    case MessageType.SVC_SERVERINFO: // 11
      return SP.lift(M.serverInfo);

    case MessageType.SVC_LIGHTSTYLE: // 12
      return SP.lift(M.lightStyle);

    case MessageType.SVC_UPDATEUSERINFO: // 13
      return SP.lift(M.updateUserInfo);

    case MessageType.SVC_DELTADESCRIPTION: // 14
      return M.deltaDescription;

    case MessageType.SVC_CLIENTDATA: // 15
      return M.clientData;

    case MessageType.SVC_STOPSOUND: // 16
      return SP.lift(M.stopSound);

    case MessageType.SVC_PINGS: // 17
      return SP.lift(M.pings);

    case MessageType.SVC_PARTICLE: // 18
      return SP.lift(M.particle);

    case MessageType.SVC_DAMAGE: // 19
      return SP.lift(M.damage);

    case MessageType.SVC_SPAWNSTATIC: // 20
      return SP.lift(M.spawnStatic);

    case MessageType.SVC_EVENT_RELIABLE: // 21
      return M.eventReliable;

    case MessageType.SVC_SPAWNBASELINE: // 22
      return M.spawnBaseline;

    case MessageType.SVC_TEMPENTITY: // 23
      return SP.lift(M.tempEntity);

    case MessageType.SVC_SETPAUSE: // 24
      return SP.lift(M.setPause);

    case MessageType.SVC_SIGNONNUM: // 25
      return SP.lift(M.signOnNum);

    case MessageType.SVC_CENTERPRINT: // 26
      return SP.lift(M.centerPrint);

    case MessageType.SVC_KILLEDMONSTER: // 27
      return SP.lift(M.killedMonster);

    case MessageType.SVC_FOUNDSECRET: // 28
      return SP.lift(M.foundSecret);

    case MessageType.SVC_SPAWNSTATICSOUND: // 29
      return SP.lift(M.spawnStaticSound);

    case MessageType.SVC_INTERMISSION: // 30
      return SP.lift(M.intermission);

    case MessageType.SVC_FINALE: // 31
      return SP.lift(M.finale);

    case MessageType.SVC_CDTRACK: // 32
      return SP.lift(M.cdTrack);

    case MessageType.SVC_RESTORE: // 33
      return SP.lift(M.restore);

    case MessageType.SVC_CUTSCENE: // 34
      return SP.lift(M.cutscene);

    case MessageType.SVC_WEAPONANIM: // 35
      return SP.lift(M.weaponAnim);

    case MessageType.SVC_DECALNAME: // 36
      return SP.lift(M.decalName);

    case MessageType.SVC_ROOMTYPE: // 37
      return SP.lift(M.roomType);

    case MessageType.SVC_ADDANGLE: // 38
      return SP.lift(M.addAngle);

    case MessageType.SVC_NEWUSERMSG: // 39
      return M.newUserMsg;

    case MessageType.SVC_PACKETENTITIES: // 40
      return M.packetEntities;

    case MessageType.SVC_DELTAPACKETENTITIES: // 41
      return M.deltaPacketEntities;

    case MessageType.SVC_CHOKE: // 42
      return SP.lift(M.choke);

    case MessageType.SVC_RESOURCELIST: // 43
      return SP.lift(M.resourceList);

    case MessageType.SVC_NEWMOVEVARS: // 44
      return SP.lift(M.newMoveVars);

    case MessageType.SVC_RESOURCEREQUEST: // 45
      return SP.lift(M.resourceRequest);

    case MessageType.SVC_CUSTOMIZATION: // 46
      return SP.lift(M.customization);

    case MessageType.SVC_CROSSHAIRANGLE: // 47
      return SP.lift(M.crosshairAngle);

    case MessageType.SVC_SOUNDFADE: // 48
      return SP.lift(M.soundFade);

    case MessageType.SVC_FILETXFERFAILED: // 49
      return SP.lift(M.fileTxferFailed);

    case MessageType.SVC_HLTV: // 50
      return SP.lift(M.hltv);

    case MessageType.SVC_DIRECTOR: // 51
      return SP.lift(M.director);

    case MessageType.SVC_VOICEINIT: // 52
      return SP.lift(M.voiceInit);

    case MessageType.SVC_VOICEDATA: // 53
      return SP.lift(M.voiceData);

    case MessageType.SVC_SENDEXTRAINFO: // 54
      return SP.lift(M.sendExtraInfo);

    case MessageType.SVC_TIMESCALE: // 55
      return SP.lift(M.timeScale);

    case MessageType.SVC_RESOURCELOCATION: // 56
      return SP.lift(M.resourceLocation);

    case MessageType.SVC_SENDCVARVALUE: // 57
      return SP.lift(M.sendCvarValue);

    case MessageType.SVC_SENDCVARVALUE2: // 58
      return SP.lift(M.sendCvarValue2);

    default:
      return SP.fail();
  }
};

export const engineMessage: (
  messageId: MessageType
) => DemoStateParser<EngineMessage> = flow(
  engineMessage_,
  SP.filter(({ name }) => name !== "SVC_NOP")
);
