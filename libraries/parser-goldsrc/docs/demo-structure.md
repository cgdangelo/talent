<!-- TOC -->
* [Introduction](#introduction)
  * [Acknowledgments](#acknowledgments)
  * [Data types](#data-types)
  * [Understanding the demo file structure and how to read](#understanding-the-demo-file-structure-and-how-to-read)
    * [File structure overview](#file-structure-overview)
    * [Reading a demo file](#reading-a-demo-file)
* [File structure](#file-structure)
  * [Demo](#demo)
  * [DemoHeader](#demoheader)
  * [Directory](#directory)
  * [DirectoryEntry](#directoryentry)
  * [Frame](#frame)
    * [Frame type mapping](#frame-type-mapping)
    * [DemoStart](#demostart)
    * [ConsoleCommand](#consolecommand)
    * [ClientData](#clientdata)
    * [NextSection](#nextsection)
    * [Event](#event)
    * [Sound](#sound)
    * [DemoBuffer](#demobuffer)
    * [NetworkMessages](#networkmessages)
      * [RefParams](#refparams)
      * [UserCmd](#usercmd)
      * [MoveVars](#movevars)
      * [SequenceInfo](#sequenceinfo)
      * [Message](#message)
        * [UserMessage](#usermessage)
          * [Unknown or variable size message](#unknown-or-variable-size-message)
        * [EngineMessage](#enginemessage)
          * [SVC_BAD (0)](#svc_bad-0)
          * [SVC_NOP (1)](#svc_nop-1)
          * [SVC_DISCONNECT (2)](#svc_disconnect-2)
          * [SVC_EVENT (3)](#svc_event-3)
          * [SVC_VERSION (4)](#svc_version-4)
          * [SVC_SETVIEW (5)](#svc_setview-5)
          * [SVC_SOUND (6)](#svc_sound-6)
          * [SVC_TIME (7)](#svc_time-7)
          * [SVC_PRINT (8)](#svc_print-8)
          * [SVC_STUFFTEXT (9)](#svc_stufftext-9)
          * [SVC_SETANGLE (10)](#svc_setangle-10)
          * [SVC_SERVERINFO (11)](#svc_serverinfo-11)
          * [SVC_LIGHTSTYLE (12)](#svc_lightstyle-12)
          * [SVC_UPDATEUSERINFO (13)](#svc_updateuserinfo-13)
          * [SVC_DELTADESCRIPTION (14)](#svc_deltadescription-14)
          * [SVC_CLIENTDATA (15)](#svc_clientdata-15)
          * [SVC_STOPSOUND (16)](#svc_stopsound-16)
          * [SVC_PINGS (17)](#svc_pings-17)
          * [SVC_PARTICLE (18)](#svc_particle-18)
          * [SVC_DAMAGE (19)](#svc_damage-19)
          * [SVC_SPAWNSTATIC (20)](#svc_spawnstatic-20)
          * [SVC_EVENTRELIABLE (21)](#svc_eventreliable-21)
          * [SVC_SPAWNBASELINE (22)](#svc_spawnbaseline-22)
          * [SVC_TEMPENTITY (23)](#svc_tempentity-23)
          * [SVC_SETPAUSE (24)](#svc_setpause-24)
          * [SVC_SIGNONNUM (25)](#svc_signonnum-25)
          * [SVC_CENTERPRINT (26)](#svc_centerprint-26)
          * [SVC_KILLEDMONSTER (27)](#svc_killedmonster-27)
          * [SVC_FOUNDSECRET (28)](#svc_foundsecret-28)
          * [SVC_SPAWNSTATICSOUND (29)](#svc_spawnstaticsound-29)
          * [SVC_INTERMISSION (30)](#svc_intermission-30)
          * [SVC_FINALE (31)](#svc_finale-31)
          * [SVC_CDTRACK (32)](#svc_cdtrack-32)
          * [SVC_RESTORE (33)](#svc_restore-33)
          * [SVC_CUTSCENE (34)](#svc_cutscene-34)
          * [SVC_WEAPONANIM (35)](#svc_weaponanim-35)
          * [SVC_DECALNAME (36)](#svc_decalname-36)
          * [SVC_ROOMTYPE (37)](#svc_roomtype-37)
          * [SVC_ADDANGLE (38)](#svc_addangle-38)
          * [SVC_NEWUSERMSG (39)](#svc_newusermsg-39)
          * [SVC_PACKETENTITIES (40)](#svc_packetentities-40)
          * [SVC_DELTAPACKETENTITIES (41)](#svc_deltapacketentities-41)
          * [SVC_CHOKE (42)](#svc_choke-42)
          * [SVC_RESOURCELIST (43)](#svc_resourcelist-43)
          * [SVC_NEWMOVEVARS (44)](#svc_newmovevars-44)
          * [SVC_RESOURCEREQUEST (45)](#svc_resourcerequest-45)
          * [SVC_CUSTOMIZATION (46)](#svc_customization-46)
          * [SVC_CROSSHAIRANGLE (47)](#svc_crosshairangle-47)
          * [SVC_SOUNDFADE (48)](#svc_soundfade-48)
          * [SVC_FILETXFERFAILED (49)](#svc_filetxferfailed-49)
          * [SVC_HLTV (50)](#svc_hltv-50)
          * [SVC_DIRECTOR (51)](#svc_director-51)
          * [SVC_VOICEINIT (52)](#svc_voiceinit-52)
          * [SVC_VOICEDATA (53)](#svc_voicedata-53)
          * [SVC_SENDEXTRAINFO (54)](#svc_sendextrainfo-54)
          * [SVC_TIMESCALE (55)](#svc_timescale-55)
          * [SVC_RESOURCELOCATION (56)](#svc_resourcelocation-56)
          * [SVC_SENDCVARVALUE (57)](#svc_sendcvarvalue-57)
          * [SVC_SENDCVARVALUE2 (58)](#svc_sendcvarvalue2-58)
  * [Changelog](#changelog)
<!-- TOC -->

# Introduction

## Acknowledgments

Sources for this information include:

- https://github.com/skyrim/hlviewer.js
- https://github.com/YaLTeR/hldemo-rs
- https://wiki.alliedmods.net/Half-Life_1_Engine_Messages
- https://wiki.alliedmods.net/Half-Life_1_Game_Events
- https://wiki.alliedmods.net/Temp_Entity_Events_(Half-Life_1)
- https://github.com/jpcy/coldemoplayer/

## Data types

| Name             | Description                                                                  |
|------------------|------------------------------------------------------------------------------|
| `T` \* N         | A N-length sequence of type `T`.                                             |
| `Int8`           | 8-bit signed integer.                                                        |
| `Int16`          | 16-bit signed integer.                                                       |
| `Int32`          | 32-bit signed integer.                                                       |
| `Word8`          | 8-bit unsigned integer.                                                      |
| `Word16`         | 16-bit unsigned integer.                                                     |
| `Word32`         | 32-bit unsigned integer.                                                     |
| `Float`          | 32-bit floating point.                                                       |
| `NullString`     | Null-terminated string.                                                      |
| `NullString (N)` | Null-padded string to minimum length N.                                      |
| `Point (T)`      | An (x, y, z) coordinate parameterized by a type `T`. Equivalent to `T` \* 3. |
| `Flag (T)`       | A boolean value parameterized by a type `T`.                                 |
| `Bits (N)`       | A number from N bits in a bit-packed message.                                |
| `? T`            | A value of type `T` that optionally appears, according to some condition.    |
| `Delta (T)`      | A set of named fields, defined by a SVC_DELTADESCRIPTION message.            |
| `RemainingBits`  | Individual bits of padding until the next byte boundary.                     |

## Understanding the demo file structure and how to read

### File structure overview

|                         | Description                                                                   |
|:------------------------|:------------------------------------------------------------------------------|
|                         | _Start of file_                                                               |
| `DemoHeader`            | Demo header                                                                   |
| `Word32`                | Directory start offset                                                        |
| `Frame`                 | Directory entry #1 frame                                                      |
| `Frame`                 | Directory entry #1 frame                                                      |
|                         | _... (frames repeat until `NextSection` frame)_                               |
| `Frame` (`NextSection`) | Directory entry #1 `NextSection` frame                                        |
| `Frame`                 | Directory entry #2 frame                                                      |
| `Frame`                 | Directory entry #2 frame                                                      |
|                         | _... (frames repeat until `NextSection` frame)_                               |
| `Frame`                 | Directory entry #2 `NextSection` frame                                        |
|                         | _... (collections of directory entry frames repeat for each directory entry)_ |
| `Word32`                | Total number of directory entries                                             |
| `DirectoryEntry`        | Directory entry #1                                                            |
| `DirectoryEntry`        | Directory entry #2                                                            |
|                         | _... (directory entries repeat for total number of directory entries times)_  |
|                         | _End of file_                                                                 |

### Reading a demo file

1. Start at the beginning of the file.

2. Read the `DemoHeader` fields.

3. Read a `Word32` immediately following the `DemoHeader`. This "directory offset" is the byte position where the
   directory entries start.

    - This value should be equal to the file size in bytes - 188.
    - If the value is 0, the client may have crashed while recording and not written the directory metadata to the demo
      file. In this scenario, frames start immediately after the header, and steps (4.) through (7.) should be skipped.

4. Seek to the directory offset and read a `Word32`. This provides the total number of directory entries.

    - This value should be between 1 and 1024.
    - In some circumstances (disconnect while recording), the total entries reported can be inaccurate.

5. Read a `DirectoryEntry`.

6. Repeat step (5.) `totalEntries` times.

7. Seek to the `DirectoryEntry` frame offset. This is the byte position where frames start.

8. Read a `Word8` to identify the frame type and then read a frame of that type.

    - See [Frame type mapping](#frame-type-mapping).

    - If the frame is a `NetworkMessages` frame, there will be a chunk of `messageLength` bytes following the initial
      fields that contains engine and user messages. To read these:

        1. Read a `Word8` to identify the message type, and read a message of that type:

            - See [UserMessage](#usermessage) if the type is `n >= 64`. The type corresponds to the index received in a
              prior SVC_NEWUSERMSG message.

            - See [EngineMessage](#enginemessage) if the type is `1 >= n < 64`. The type corresponds to one of the SVC\_
              messages.

        2. Repeat step (b.) until the chunk of `messageLength` bytes has been exhausted.

9. Repeat step (8.) until a `NextSection` frame has been read.

10. Associate the frames read with the current `DirectoryEntry`.

11. Repeat steps (7.) through (9.) for each `DirectoryEntry`.

# File structure

## Demo

| Name      | Type         | Description                   |
|-----------|--------------|-------------------------------|
| header    | `DemoHeader` | Metadata about the demo file. |
| directory | `Directory`  | Container for entry "files".  |

## DemoHeader

| Name            | Type               | Description                                                                                               |
|-----------------|--------------------|-----------------------------------------------------------------------------------------------------------|
| magic           | `NullString (8) `  | `HLDEMO` for GoldSrc, `HLDEMO2` for Source.                                                               |
| demoProtocol    | `Word32`           | Protocol version the demo was recorded in. Expected to be `5`.                                            |
| networkProtocol | `Word32`           | Network version the demo was recorded in. Can be used to deal with format changes.                        |
| mapName         | `NullString (260)` | Name of the map.                                                                                          |
| gameDirectory   | `NullString (260)` | Name of the directory: `valve` for Half-Life, `cstrike` for Counter-Strike, `dod` for Day of Defeat, etc. |
| mapChecksum     | `Int32`            | CRC32 map file checksum. A checksum mismatch will cause the client to disconnect.                         |
| directoryOffset | `Word32`           | Byte position of the directory.                                                                           |

## Directory

| Name         | Type     | Description                                                            |
|--------------|----------|------------------------------------------------------------------------|
| totalEntries | `Word32` | Total number of entries in the directory. Expected to be in [1, 1024]. |

## DirectoryEntry

| Name         | Type              | Description                                          |
|--------------|-------------------|------------------------------------------------------|
| type         | `Word32`          |                                                      |
| description  | `NullString (64)` | Name of the entry.                                   |
| flags        | `Word32`          |                                                      |
| cdTrack      | `Int32`           |                                                      |
| trackTime    | `Float`           |                                                      |
| framesCount  | `Word32`          | Total frames in the entry.                           |
| framesOffset | `Word32`          | Byte position where the entry's frames start.        |
| fileLength   | `Word32`          | Length of the entry.                                 |
| frames       | `Frame` \* N      | Continue reading until reaching a NextSection frame. |

## Frame

| Name      | Type     | Description                                    |
|-----------|----------|------------------------------------------------|
| frameType | `Word8`  | Frame type id.                                 |
| time      | `Float`  | Time in seconds since recording began.         |
| frame     | `Word32` | Frame index.                                   |
| frameData |          | See [Frame type mapping](#frame-type-mapping). |

### Frame type mapping

| Type | Frame type        | Description                             |
|------|-------------------|-----------------------------------------|
| 0    | `NetworkMessages` | Data from the server.                   |
| 1    | `NetworkMessages` | Data from the server.                   |
| 2    | `DemoStart`       | First frame of demo playback.           |
| 3    | `ConsoleCommand`  | A console command executed by the user. |
| 4    | `ClientData`      | Client state information.               |
| 5    | `NextSection`     | Final frame of the directory entry.     |
| 6    | `Event`           | Game engine event.                      |
| 7    | `WeaponAnimation` |                                         |
| 8    | `Sound`           |                                         |
| 9    | `DemoBuffer`      |                                         |

### DemoStart

This frame has no additional fields.

### ConsoleCommand

| Name    | Type              | Description |
|---------|-------------------|-------------|
| command | `NullString (64)` |             |

### ClientData

| Name       | Type            | Description |
|------------|-----------------|-------------|
| origin     | `Point (Float)` |             |
| viewAngles | `Point (Float)` |             |
| weaponBits | `Word32`        |             |
| fov        | `Float`         |             |

### NextSection

This frame has no additional fields.

### Event

| Name  | Type        | Description |
|-------|-------------|-------------|
| flags | `Int32`     |             |
| index | `Int32`     |             |
| delay | `Float`     |             |
| args  | `EventArgs` |             |

**EventArgs**

| Name        | Type            | Description |
|-------------|-----------------|-------------|
| flags       | `Word32`        |             |
| entityIndex | `Word32`        |             |
| origin      | `Point (Float)` |             |
| angles      | `Point (Float)` |             |
| velocity    | `Point (Float)` |             |
| ducking     | `Flag (Word32)` |             |
| fparam1     | `Float`         |             |
| fparam2     | `Float`         |             |
| iparam1     | `Int32`         |             |
| iparam2     | `Int32`         |             |
| bparam1     | `Flag (Int32)`  |             |
| bparam2     | `Flag (Int32)`  |             |

### Sound

| Name         | Type                    | Description |
|--------------|-------------------------|-------------|
| channel      | `Int32`                 |             |
| sampleLength | `Word32`                |             |
| sample       | `Word8` \* sampleLength |             |
| attenuation  | `Float`                 |             |
| volume       | `Float`                 |             |
| flags        | `Int32`                 |             |
| pitch        | `Int32`                 |             |

### DemoBuffer

| Name         | Type                    | Description |
|--------------|-------------------------|-------------|
| bufferLength | `Word32`                |             |
| buffer       | `Word8` \* bufferLength |             |

### NetworkMessages

| Name           | Type            | Description                                                                  |
|----------------|-----------------|------------------------------------------------------------------------------|
| timestamp      | `Float`         |                                                                              |
| refParams      | `RefParams`     |                                                                              |
| userCmd        | `UserCmd`       |                                                                              |
| moveVars       | `MoveVars`      |                                                                              |
| view           | `Point (Float)` |                                                                              |
| viewModel      | `Int32`         |                                                                              |
| sequenceInfo   | `SequenceInfo`  |                                                                              |
| messagesLength | `Word32`        | Length of buffer that contains messages. Expected to be in [0, 65536].       |
| messages       | `Message` \* N  | Variable number of engine/user messages that fits into messagesLength bytes. |

#### RefParams

| Name           | Type            | Description |
|----------------|-----------------|-------------|
| viewOrigin     | `Point (Float)` |             |
| viewAngles     | `Point (Float)` |             |
| forward        | `Point (Float)` |             |
| right          | `Point (Float)` |             |
| up             | `Point (Float)` |             |
| frameTime      | `Float`         |             |
| time           | `Float`         |             |
| intermission   | `Flag (Int32)`  |             |
| paused         | `Flag (Int32)`  |             |
| spectator      | `Flag (Int32)`  |             |
| onGround       | `Flag (Int32)`  |             |
| waterLevel     | `Int32`         |             |
| simVel         | `Point (Float)` |             |
| simOrg         | `Point (Float)` |             |
| viewHeight     | `Point (Float)` |             |
| idealPitch     | `Float`         |             |
| cl_viewangles  | `Point (Float)` |             |
| health         | `Int32`         |             |
| crosshairAngle | `Point (Float)` |             |
| viewSize       | `Float`         |             |
| punchAngle     | `Point (Float)` |             |
| maxClients     | `Int32`         |             |
| viewEntity     | `Int32`         |             |
| plaerNum       | `Int32`         |             |
| maxEntities    | `Int32`         |             |
| demoPlayback   | `Int32`         |             |
| hardware       | `Int32`         |             |
| smoothing      | `Int32`         |             |
| ptrCmd         | `Int32`         |             |
| ptrMoveVars    | `Int32`         |             |
| viewPort       | `Int32` \* 4    |             |
| nextView       | `Int32`         |             |
| onlyClientDraw | `Int32`         |             |

#### UserCmd

| Name           | Type            | Description |
|----------------|-----------------|-------------|
| lerpMs         | `Int16`         |             |
| ms             | `Word8`         |             |
| _unknown_      | `Word8`         |             |
| viewAngles     | `Point (Float)` |             |
| forwardMove    | `Float`         |             |
| sideMove       | `Float`         |             |
| upMove         | `Float`         |             |
| lightLevel     | `Int8`          |             |
| _unknown_      | `Word8`         |             |
| buttons        | `Word16`        |             |
| impulse        | `Int8`          |             |
| weaponSelect   | `Int8`          |             |
| _unknown_      | `Word8` \* 2    |             |
| impactIndex    | `Int32`         |             |
| impactPosition | `Point (Float)` |             |

#### MoveVars

| Name              | Type              | Description |
|-------------------|-------------------|-------------|
| gravity           | `Float`           |             |
| stopSpeed         | `Float`           |             |
| maxSpeed          | `Float`           |             |
| spectatorMaxSpeed | `Float`           |             |
| accelerate        | `Float`           |             |
| airAccelerate     | `Float`           |             |
| waterAccelerate   | `Float`           |             |
| friction          | `Float`           |             |
| edgeFriction      | `Float`           |             |
| waterFriction     | `Float`           |             |
| entGravity        | `Float`           |             |
| bounce            | `Float`           |             |
| stepSize          | `Float`           |             |
| maxVelocity       | `Float`           |             |
| zMax              | `Float`           |             |
| waveHeight        | `Float`           |             |
| footsteps         | `Flag (Int32)`    |             |
| skyName           | `NullString (32)` |             |
| rollAngle         | `Float`           |             |
| rollSpeed         | `Float`           |             |
| skyColor          | `Float` \* 3      |             |
| skyVec            | `Point (Float)`   |             |

#### SequenceInfo

| Name                         | Type    | Description |
|------------------------------|---------|-------------|
| incomingSequence             | `Int32` |             |
| incomingAcknowledged         | `Int32` |             |
| incomingReliableAcknowledged | `Int32` |             |
| incomingReliableSequence     | `Int32` |             |
| outgoingSequence             | `Int32` |             |
| reliableSequence             | `Int32` |             |
| lastReliableSequence         | `Int32` |             |

#### Message

| Name        | Type    | Description      |
|-------------|---------|------------------|
| messageType | `Word8` | Message type id. |

##### UserMessage

Any message with an id of 64 or greater is a user message. That message id corresponds to the index field originally
sent in SVC_NEWUSERMSG. If the user message size specific in SVC_NEWUSERMSG is greater than -1, read that number
of `Word8` values.

If the message was not sent in SVC_NEWUSERMSG, or the message was sent with a size field value of -1, read a
single `Word8` to obtain the message length, then read that number of `Word8` values.

###### Unknown or variable size message

| Name      | Type              | Description                                     |
|-----------|-------------------|-------------------------------------------------|
| length    | `Word8`           | Total size of data sent with this user message. |
| _unknown_ | `Word8` \* length |                                                 |

##### EngineMessage

###### SVC_BAD (0)

This message has no fields.

###### SVC_NOP (1)

This message has no fields.

###### SVC_DISCONNECT (2)

| Name   | Type         | Description |
|--------|--------------|-------------|
| reason | `NullString` |             |

###### SVC_EVENT (3)

| Name       | Type                  | Description                            |
|------------|-----------------------|----------------------------------------|
| eventCount | `Bits (5)`            | Total number of events in the message. |
| events     | `Event` \* eventCount |                                        |

**Event**

| Name           | Type                | Description                         |
|----------------|---------------------|-------------------------------------|
| eventIndex     | `Bits (10)`         |                                     |
| hasPacketIndex | `Flag (Bits (1))`   |                                     |
| packetIndex    | `? Bits (11)`       | Only sent if hasPacketIndex is set. |
| hasDelta       | `? Flag (Bits(1))`  | Only sent if hasPacketIndex is set. |
| delta          | `? Delta (event_t)` | Only sent if hasDelta is set.       |
| hasFireTime    | `Flag (Bits (1))`   |                                     |
| fireTime       | `Bits (16)`         | Only sent if hasFireTime is set.    |
|                | `RemainingBits`     |                                     |

###### SVC_VERSION (4)

| Name            | Type     | Description |
|-----------------|----------|-------------|
| protocolVersion | `Word32` |             |

###### SVC_SETVIEW (5)

| Name        | Type    | Description |
|-------------|---------|-------------|
| entityIndex | `Int16` |             |

###### SVC_SOUND (6)

| Name            | Type              | Description                                                                         |
|-----------------|-------------------|-------------------------------------------------------------------------------------|
| flags           | `Bits (9)`        | Determines which fields are present.                                                |
| volume          | `? Bits (8)`      | Only sent if the SND_VOLUME bit is set in flags (flags & 1). Value scaled by 1/255. |
| attenuation     | `? Bits (8)`      | Only sent if the SND_ATTN bit is set in flags (flags & 2).                          |
| channel         | `Bits (3)`        |                                                                                     |
| entityIndex     | `Bits (11)`       |                                                                                     |
| soundIndexLong  | `? Bits (16)`     | Only sent if the SND_LONG_INDEX bit is set in flags (flags & 4).                    |
| soundIndexShort | `? Bits (8)`      | Only sent if the SND_LONG_INDEX bit is not set in flags (flags ~ 4).                |
| hasX            | `Flag (Bits (1))` |                                                                                     |
| hasY            | `Flag (Bits (1))` |                                                                                     |
| hasZ            | `Flag (Bits (1))` |                                                                                     |
| originX         | `OriginCoord`     | Only sent if hasX is set. Use 0 otherwise. See below.                               |
| originY         | `OriginCoord`     | Only sent if hasY is set. Use 0 otherwise. See below.                               |
| orginZ          | `OriginCoord`     | Only sent if hasZ is set. Use 0 otherwise. See below.                               |
| pitch           | `? Bits (8)`      | Only sent if the SND_PITCH bit is set in flags (flags & 8). Use 1 otherwise.        |
|                 | `RemainingBits`   |                                                                                     |

**OriginCoord**

| Name          | Type                | Description                                   |
|---------------|---------------------|-----------------------------------------------|
| intFlag       | `Flag (Bits (1))`   |                                               |
| fractionFlag  | `Flag (Bits (1))`   |                                               |
| isNegative    | `? Flag (Bits (1))` | Only set if intFlag or fractionFlag is set.   |
| intValue      | `? Bits (12)`       | Only sent if intFlag is set. Use 0 otherwise. |
| fractionValue | `? Bits (3)`        | Only sent if intFlag is set. Use 0 otherwise. |
| _unknown_     | `Bits (2)`          |                                               |
|               | `RemainingBits`     |                                               |

Once the coordinate has been read, calculate intValue + fractionValue / 32, and flip negative if isNegative is set.

###### SVC_TIME (7)

| Name | Type    | Description |
|------|---------|-------------|
| time | `Float` |             |

###### SVC_PRINT (8)

| Name    | Type         | Description |
|---------|--------------|-------------|
| message | `NullString` |             |

###### SVC_STUFFTEXT (9)

| Name    | Type         | Description |
|---------|--------------|-------------|
| command | `NullString` |             |

###### SVC_SETANGLE (10)

| Name  | Type    | Description                    |
|-------|---------|--------------------------------|
| pitch | `Int16` | Multiply by 1 / (65536 / 360)  |
| yaw   | `Int16` | Multiply by 1 / (65536 / 360). |
| roll  | `Int16` | Multiply by 1 / (65536 / 360). |

###### SVC_SERVERINFO (11)

| Name          | Type           | Description |
|---------------|----------------|-------------|
| protocol      | `Int32`        |             |
| spawnCount    | `Int32`        |             |
| mapChecksum   | `Int32`        |             |
| clientDllHash | `Word8` \* 16  |             |
| maxPlayers    | `Word8`        |             |
| playerIndex   | `Word8`        |             |
| isDeathmatch  | `Flag (Word8)` |             |
| gameDir       | `NullString`   |             |
| hostname      | `NullString`   |             |
| mapFileName   | `NullString`   |             |
| mapCycle      | `NullString`   |             |
| _unknown_     | `Word8`        |             |

###### SVC_LIGHTSTYLE (12)

| Name      | Type         | Description |
|-----------|--------------|-------------|
| index     | `Word8`      |             |
| lightInfo | `NullString` |             |

###### SVC_UPDATEUSERINFO (13)

| Name      | Type          | Description                                                            |
|-----------|---------------|------------------------------------------------------------------------|
| index     | `Word8`       |                                                                        |
| id        | `Word32`      |                                                                        |
| userInfo  | `NullString`  | A string of field names and their values in the format `field//value`. |
| cdKeyHash | `Word8` \* 16 |                                                                        |

###### SVC_DELTADESCRIPTION (14)

| Name        | Type                                         | Description                    |
|-------------|----------------------------------------------|--------------------------------|
| name        | `NullString`                                 | An identifier for the decoder. |
| totalFields | `Word16`                                     |                                |
| fields      | `Delta (delta_description_t)` \* totalFields |                                |
|             | `RemainingBits`                              |                                |

These should be saved and used to later decode deltas of the given name.

See Delta decoding for more.

###### SVC_CLIENTDATA (15)

| Name               | Type                      | Description                             |
|--------------------|---------------------------|-----------------------------------------|
| hasDeltaUpdateMask | `? Flag (Bits (1))`       | Only sent if not an HLTV demo.          |
| deltaUpdateMask    | `? Bits (8)`              | Only sent if hasDeltaUpdateMask is set. |
| clientData         | `? Delta (clientdata_t)`  | Only sent if not an HLTV demo.          |
| hasWeaponData      | `? Flag (Bits (1))`       | Only sent if not an HLTV demo.          |
| weaponIndex        | `? Bits (6)`              | Only sent if hasWeaponData is set.      |
| weaponData         | `? Delta (weapon_data_t)` | Only sent if hasWeaponData is set.      |
|                    | `? RemainingBits`         |                                         |

###### SVC_STOPSOUND (16)

| Name        | Type    | Description |
|-------------|---------|-------------|
| entityIndex | `Int16` |             |

###### SVC_PINGS (17)

| Name  | Type            | Description                                    |
|-------|-----------------|------------------------------------------------|
| pings | `Ping` \* N     | Continue reading until hasPingData is not set. |
|       | `RemainingBits` |                                                |

| Name        | Type         | Description                      |
|-------------|--------------|----------------------------------|
| hasPingData | `Bits (1)`   |                                  |
| playerId    | `? Bits (8)` | Only sent if hasPingData is set. |
| ping        | `? Bits (8)` | Only sent if hasPingData is set. |
| loss        | `? Bits (8)` | Only sent if hasPingData is set. |

###### SVC_PARTICLE (18)

| Name      | Type            | Description        |
|-----------|-----------------|--------------------|
| origin    | `Point (Int16)` | Multiply by 1 / 8. |
| direction | `Point (Int8)`  |                    |
| count     | `Word8`         |                    |
| color     | `Word8`         |                    |

###### SVC_DAMAGE (19)

_Deprecated_

This message has no fields.

###### SVC_SPAWNSTATIC (20)

| Name          | Type           | Description                        |
|---------------|----------------|------------------------------------|
| modelIndex    | `Int16`        |                                    |
| sequence      | `Int8`         |                                    |
| frame         | `Int8`         |                                    |
| colorMap      | `Int16`        |                                    |
| skin          | `Int8`         |                                    |
| originX       | `Int16`        | Multiply by 1 / 8.                 |
| rotationX     | `Int8`         | Multiply by 360 / 256.             |
| originY       | `Int16`        | Multiply by 1 / 8.                 |
| rotationY     | `Int8`         | Multiply by 360 / 256.             |
| originZ       | `Int16`        | Multiply by 1 / 8.                 |
| rotationZ     | `Int8`         | Multiply by 360 / 256.             |
| hasRenderMode | `Flag (Int8)`  |                                    |
| renderColor   | `? Word8` \* 3 | Only sent if hasRenderMode is set. |

###### SVC_EVENTRELIABLE (21)

| Name        | Type                   | Description |
|-------------|------------------------|-------------|
| eventIndex  | `Bits (10)`            |             |
| eventArgs   | `Delta (event_args_t)` |             |
| hasFireTime | `Flag (Bits (1))`      |             |
| fireTime    | `? Bits (16)`          |             |
|             | `RemainingBits`        |             |

###### SVC_SPAWNBASELINE (22)

| Name     | Type            | Description                                                          |
|----------|-----------------|----------------------------------------------------------------------|
| entities | `Entity` \* N   | Continue reading until entityIndex has all bits set ((1 << 11) - 1). |
|          | `RemainingBits` |                                                                      |

**Entity**

| Name           | Type                                       | Description                                                                                                         |
|----------------|--------------------------------------------|---------------------------------------------------------------------------------------------------------------------|
| index          | `Bits (110)`                               |                                                                                                                     |
| type           | `Bits (2)`                                 |                                                                                                                     |
| delta          | `? Delta (entity_state_player_t)`          | Only sent if the type bit is set in flags (flags & 1) and entityIndex is between 0 and the server's maxClients.     |
| delta          | `? Delta (entity_state_t)`                 | Only sent if the type bit is set in flags (flags & 1) and entityIndex is not between 0 and the server's maxClients. |
| delta          | `? Delta (custom_entity_state_t)`          | Only sent if the type bit is not set in flags (flags ~ 1).                                                          |
| footer         | `Bits (5)`                                 | Expected to have all bits set ((1 << 5) - 1).                                                                       |
| totalExtraData | `Bits (6)`                                 |                                                                                                                     |
| extraData      | `Delta (entity_state_t)` \* totalExtraData |                                                                                                                     |

###### SVC_TEMPENTITY (23)

| Name       | Type    | Description                                                                      |
|------------|---------|----------------------------------------------------------------------------------|
| entityType | `Word8` | Indicates which of the numbered sections should be used to read the entity data. |

**TE_BEAMPOINTS (0)**

| Name      | Type          | Description |
|-----------|---------------|-------------|
| _unknown_ | `Word8` \* 24 |             |

**TE_BEAMENTPOINT (1)**

| Name      | Type          | Description |
|-----------|---------------|-------------|
| _unknown_ | `Word8` \* 20 |             |

**TE_GUNSHOT (2)**

| Name      | Type         | Description |
|-----------|--------------|-------------|
| _unknown_ | `Word8` \* 6 |             |

**TE_EXPLOSION (3)**

| Name      | Type         | Description |
|-----------|--------------|-------------|
| _unknown_ | `Word8` \* 6 |             |

**TE_TAREXPLOSION (4)**

| Name      | Type         | Description |
|-----------|--------------|-------------|
| _unknown_ | `Word8` \* 6 |             |

**TE_SMOKE (5)**

| Name      | Type          | Description |
|-----------|---------------|-------------|
| _unknown_ | `Word8` \* 10 |             |

**TE_TRACER (6)**

| Name      | Type          | Description |
|-----------|---------------|-------------|
| _unknown_ | `Word8` \* 12 |             |

**TE_LIGHTNING (7)**

| Name      | Type          | Description |
|-----------|---------------|-------------|
| _unknown_ | `Word8` \* 17 |             |

**TE_BEAMENTS (8)**

| Name      | Type          | Description |
|-----------|---------------|-------------|
| _unknown_ | `Word8` \* 16 |             |

**TE_SPARKS (9)**

| Name      | Type         | Description |
|-----------|--------------|-------------|
| _unknown_ | `Word8` \* 6 |             |

**TE_LAVASPLASH (10)**

| Name      | Type         | Description |
|-----------|--------------|-------------|
| _unknown_ | `Word8` \* 6 |             |

**TE_TELEPORT (11)**

| Name      | Type         | Description |
|-----------|--------------|-------------|
| _unknown_ | `Word8` \* 6 |             |

**TE_EXPLOSION2 (12)**

| Name      | Type         | Description |
|-----------|--------------|-------------|
| _unknown_ | `Word8` \* 8 |             |

**TE_BSPDECAL (13)**

| Name        | Type           | Description                      |
|-------------|----------------|----------------------------------|
| _unknown_   | `Word8` \* 8   |                                  |
| entityIndex | `Int16`        |                                  |
| _unknown_   | `? Word8` \* 2 | Only sent if entityIndex is set. |

**TE_IMPLOSION (14)**

| Name      | Type         | Description |
|-----------|--------------|-------------|
| _unknown_ | `Word8` \* 9 |             |

**TE_SPRITETRAIL (15)**

| Name      | Type          | Description |
|-----------|---------------|-------------|
| _unknown_ | `Word8` \* 19 |             |

**TE_SPRITE (16)**

| Name      | Type          | Description |
|-----------|---------------|-------------|
| _unknown_ | `Word8` \* 10 |             |

**TE_BEAMSPRITE (18)**

| Name      | Type          | Description |
|-----------|---------------|-------------|
| _unknown_ | `Word8` \* 16 |             |

**TE_BEAMTORUS (19)**

| Name      | Type          | Description |
|-----------|---------------|-------------|
| _unknown_ | `Word8` \* 24 |             |

**TE_BEAMDISK (20)**

| Name      | Type          | Description |
|-----------|---------------|-------------|
| _unknown_ | `Word8` \* 24 |             |

**TE_BEAMCYLINDER (21)**

| Name      | Type          | Description |
|-----------|---------------|-------------|
| _unknown_ | `Word8` \* 24 |             |

**TE_BEAMFOLLOW (22)**

| Name      | Type          | Description |
|-----------|---------------|-------------|
| _unknown_ | `Word8` \* 10 |             |

**TE_GLOWSPRITE (23)**

| Name      | Type          | Description |
|-----------|---------------|-------------|
| _unknown_ | `Word8` \* 11 |             |

**TE_BEAMRING (24)**

| Name      | Type          | Description |
|-----------|---------------|-------------|
| _unknown_ | `Word8` \* 16 |             |

**TE_STREAK_SPLASH (25)**

| Name      | Type          | Description |
|-----------|---------------|-------------|
| _unknown_ | `Word8` \* 19 |             |

**TE_DLIGHT (27)**

| Name      | Type          | Description |
|-----------|---------------|-------------|
| _unknown_ | `Word8` \* 12 |             |

**TE_ELIGHT (28)**

| Name      | Type          | Description |
|-----------|---------------|-------------|
| _unknown_ | `Word8` \* 16 |             |

**TE_TEXTMESSAGE (29)**

| Name        | Type         | Description                 |
|-------------|--------------|-----------------------------|
| channel     | `Int8`       |                             |
| x           | `Int16`      |                             |
| y           | `Int16`      |                             |
| effect      | `Int8`       |                             |
| textColor   | `Word8` \* 4 | Presumably (r, g, b, a).    |
| fadeInTime  | `Int16`      |                             |
| fadeOutTime | `Int16`      |                             |
| holdTime    | `Int16`      |                             |
| effectTime  | `? Int16`    | Only sent if effect is set. |
| message     | `NullString` |                             |

**TE_LINE (30)**

| Name      | Type          | Description |
|-----------|---------------|-------------|
| _unknown_ | `Word8` \* 17 |             |

**TE_BOX (31)**

| Name      | Type          | Description |
|-----------|---------------|-------------|
| _unknown_ | `Word8` \* 17 |             |

**TE_KILLBEAM (99)**

| Name      | Type         | Description |
|-----------|--------------|-------------|
| _unknown_ | `Word8` \* 2 |             |

**TE_LARGEFUNNEL (100)**

| Name      | Type          | Description |
|-----------|---------------|-------------|
| _unknown_ | `Word8` \* 10 |             |

**TE_BLOODSTREAM (101)**

| Name      | Type          | Description |
|-----------|---------------|-------------|
| _unknown_ | `Word8` \* 14 |             |

**TE_SHOWLINE (102)**

| Name      | Type          | Description |
|-----------|---------------|-------------|
| _unknown_ | `Word8` \* 12 |             |

**TE_BLOOD (103)**

| Name      | Type          | Description |
|-----------|---------------|-------------|
| _unknown_ | `Word8` \* 14 |             |

**TE_DECAL (104)**

| Name      | Type         | Description |
|-----------|--------------|-------------|
| _unknown_ | `Word8` \* 9 |             |

**TE_FIZZ (105)**

| Name      | Type         | Description |
|-----------|--------------|-------------|
| _unknown_ | `Word8` \* 5 |             |

**TE_MODEL (106)**

| Name      | Type          | Description |
|-----------|---------------|-------------|
| _unknown_ | `Word8` \* 17 |             |

**TE_EXPLODEMODEL (107)**

| Name      | Type          | Description |
|-----------|---------------|-------------|
| _unknown_ | `Word8` \* 13 |             |

**TE_BREAKMODEL (108)**

| Name      | Type          | Description |
|-----------|---------------|-------------|
| _unknown_ | `Word8` \* 13 |             |

**TE_GUNSHOTDECAL (109)**

| Name      | Type         | Description |
|-----------|--------------|-------------|
| _unknown_ | `Word8` \* 9 |             |

**TE_SPRITE_SPRAY (110)**

| Name      | Type          | Description |
|-----------|---------------|-------------|
| _unknown_ | `Word8` \* 17 |             |

**TE_ARMOR_RICOCHET (111)**

| Name      | Type         | Description |
|-----------|--------------|-------------|
| _unknown_ | `Word8` \* 7 |             |

**TE_PLAYERDECAL (112)**

| Name      | Type          | Description |
|-----------|---------------|-------------|
| _unknown_ | `Word8` \* 10 |             |

**TE_BUBBLES (113)**

| Name      | Type          | Description |
|-----------|---------------|-------------|
| _unknown_ | `Word8` \* 10 |             |

**TE_BUBBLETRAIL (114)**

| Name      | Type          | Description |
|-----------|---------------|-------------|
| _unknown_ | `Word8` \* 19 |             |

**TE_BLOODSPRITE (115)**

| Name      | Type          | Description |
|-----------|---------------|-------------|
| _unknown_ | `Word8` \* 12 |             |

**TE_WORLDDECAL (116)**

| Name      | Type         | Description |
|-----------|--------------|-------------|
| _unknown_ | `Word8` \* 7 |             |

**TE_WORLDDECALHIGH (117)**

| Name      | Type         | Description |
|-----------|--------------|-------------|
| _unknown_ | `Word8` \* 7 |             |

**TE_DECALHIGH (118)**

| Name      | Type         | Description |
|-----------|--------------|-------------|
| _unknown_ | `Word8` \* 9 |             |

**TE_PROJECTILE (119)**

| Name      | Type          | Description |
|-----------|---------------|-------------|
| _unknown_ | `Word8` \* 16 |             |

**TE_SPRAY (120)**

| Name      | Type          | Description |
|-----------|---------------|-------------|
| _unknown_ | `Word8` \* 18 |             |

**TE_PLAYERSPRITES (121)**

| Name      | Type         | Description |
|-----------|--------------|-------------|
| _unknown_ | `Word8` \* 5 |             |

**TE_PARTICLEBURST (122)**

| Name      | Type          | Description |
|-----------|---------------|-------------|
| _unknown_ | `Word8` \* 10 |             |

**TE_FIREFIELD (123)**

| Name      | Type         | Description |
|-----------|--------------|-------------|
| _unknown_ | `Word8` \* 9 |             |

**TE_PLAYERATTACHMENT (124)**

| Name      | Type         | Description |
|-----------|--------------|-------------|
| _unknown_ | `Word8` \* 7 |             |

**TE_KILLPLAYERATTACHMENTS (125)**

| Name      | Type         | Description |
|-----------|--------------|-------------|
| _unknown_ | `Word8` \* 1 |             |

**TE_MULTIGUNSHOT (126)**

| Name      | Type          | Description |
|-----------|---------------|-------------|
| _unknown_ | `Word8` \* 10 |             |

**TE_USERTRACER (127)**

| Name      | Type          | Description |
|-----------|---------------|-------------|
| _unknown_ | `Word8` \* 15 |             |

###### SVC_SETPAUSE (24)

| Name     | Type          | Description |
|----------|---------------|-------------|
| isPaused | `Flag (Int8)` |             |

###### SVC_SIGNONNUM (25)

| Name | Type          | Description |
|------|---------------|-------------|
| sign | `Flag (Int8)` |             |

###### SVC_CENTERPRINT (26)

| Name    | Type         | Description |
|---------|--------------|-------------|
| message | `NullString` |             |

###### SVC_KILLEDMONSTER (27)

_Deprecated_

This message has no fields.

###### SVC_FOUNDSECRET (28)

_Deprecated_

This message has no fields.

###### SVC_SPAWNSTATICSOUND (29)

| Name        | Type            | Description                        |
|-------------|-----------------|------------------------------------|
| origin      | `Point (Int16)` | Multiply each coordinate by 1 / 8. |
| soundIndex  | `Word16`        |                                    |
| volume      | `Word8`         | Multiply by 1 / 255.               |
| attenuation | `Word8`         | Multiply by 1 / 64.                |
| entityIndex | `Word16`        |                                    |
| pitch       | `Word8`         |                                    |
| flags       | `Word8`         |                                    |

###### SVC_INTERMISSION (30)

This message has no fields.

###### SVC_FINALE (31)

| Name | Type         | Description |
|------|--------------|-------------|
| text | `NullString` |             |

###### SVC_CDTRACK (32)

| Name      | Type          | Description |
|-----------|---------------|-------------|
| track     | `Int8`        |             |
| loopTrack | `Flag (Int8)` |             |

###### SVC_RESTORE (33)

| Name     | Type                     | Description |
|----------|--------------------------|-------------|
| saveName | `NullString`             |             |
| mapCount | `Word8`                  |             |
| mapNames | `NullString` \* mapCount |             |

###### SVC_CUTSCENE (34)

| Name | Type         | Description |
|------|--------------|-------------|
| text | `NullString` |             |

###### SVC_WEAPONANIM (35)

| Name                 | Type   | Description |
|----------------------|--------|-------------|
| sequenceNumber       | `Int8` |             |
| weaponModelBodyGroup | `Int8` |             |

###### SVC_DECALNAME (36)

| Name          | Type         | Description |
|---------------|--------------|-------------|
| positionIndex | `Word8`      |             |
| decalName     | `NullString` |             |

###### SVC_ROOMTYPE (37)

| Name     | Type     | Description                |
|----------|----------|----------------------------|
| roomType | `Word16` | Expected to be in [0, 28]. |

<!-- TODO Add type mapping -->

###### SVC_ADDANGLE (38)

| Name       | Type    | Description                    |
|------------|---------|--------------------------------|
| angleToAdd | `Int16` | Multiply by 1 / (65536 / 360). |

###### SVC_NEWUSERMSG (39)

| Name  | Type              | Description                                                  |
|-------|-------------------|--------------------------------------------------------------|
| index | `Word8`           |                                                              |
| size  | `Word8`           | Total size of data that will be sent with this user message. |
| name  | `NullString (16)` |                                                              |

###### SVC_PACKETENTITIES (40)

| Name         | Type               | Description                                         |
|--------------|--------------------|-----------------------------------------------------|
| entityCount  | `Bits (16)`        | Unreliable.                                         |
| entityStates | `EntityState` \* N | Continue reading until the footer bits are not set. |

**EntityState**

| Name                  | Type                              | Description                                                                                                                              |
|-----------------------|-----------------------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| incrementEntityNumber | `Flag (Bits (1))`                 | If set, the current entity index should be increased by 1.                                                                               |
| isAbsoluteEntityIndex | `? Flag (Bits (1))`               | If set, the current entity index should be set to an upcoming value. Only sent if incrementEntityNumber is not set.                      |
| absoluteEntityIndex   | `? Bits (11)`                     | Only sent if incrementEntityNumber is not set, and isAbsoluteEntityIndex is set. The entity index should be set to this value.           |
| entityIndexDifference | `? Bits (6)`                      | Only sent if incrementEntityNumber is not set, and isAbsoluteEntityIndex is not set. The entity index should be increased by this value. |
| hasCustomDelta        | `Flag (Bits (1))`                 |                                                                                                                                          |
| hasBaselineIndex      | `Flag (Bits (1))`                 |                                                                                                                                          |
| baselineIndex         | `? Bits (6)`                      | Only sent if hasBaselineIndex is set.                                                                                                    |
| delta                 | `? Delta (entity_state_player_t)` | Only sent if entityIndex is between 0 and the server's maxClients.                                                                       |
| delta                 | `? Delta (entity_state_t)`        | Only sent if entityIndex is not between 0 and the server's maxClients, and hasCustomDelta is not set.                                    |
| delta                 | `? Delta (custom_entity_state_t)` | Only sent if entityIndex is not between 0 and the server's maxClients, and hasCustomDelta is set.                                        |
|                       | `RemainingBits`                   |                                                                                                                                          |

###### SVC_DELTAPACKETENTITIES (41)

| Name          | Type               | Description                                         |
|---------------|--------------------|-----------------------------------------------------|
| entityCount   | `Bits (16)`        | Unreliable.                                         |
| deltaSequence | `Bits (8)`         |                                                     |
| entityStates  | `EntityState` \* N | Continue reading until the footer bits are not set. |

**EntityState**

| Name                  | Type                              | Description                                                                                                                              |
|-----------------------|-----------------------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| incrementEntityNumber | `Flag (Bits (1))`                 | If set, the current entity index should be increased by 1.                                                                               |
| isAbsoluteEntityIndex | `? Flag (Bits (1))`               | If set, the current entity index should be set to an upcoming value. Only sent if incrementEntityNumber is not set.                      |
| absoluteEntityIndex   | `? Bits (11)`                     | Only sent if incrementEntityNumber is not set, and isAbsoluteEntityIndex is set. The entity index should be set to this value.           |
| entityIndexDifference | `? Bits (6)`                      | Only sent if incrementEntityNumber is not set, and isAbsoluteEntityIndex is not set. The entity index should be increased by this value. |
| hasCustomDelta        | `Flag (Bits (1))`                 |                                                                                                                                          |
| hasBaselineIndex      | `Flag (Bits (1))`                 |                                                                                                                                          |
| baselineIndex         | `? Bits (6)`                      | Only sent if hasBaselineIndex is set.                                                                                                    |
| delta                 | `? Delta (entity_state_player_t)` | Only entityIndex is between 0 and the server's maxClients.                                                                               |
| delta                 | `? Delta (entity_state_t)`        | Only sent entityIndex is not between 0 and the server's maxClients, and hasCustomDelta is not set.                                       |
| delta                 | `? Delta (custom_entity_state_t)` | Only sent entityIndex is not between 0 and the server's maxClients, and hasCustomDelta is set.                                           |
|                       | `RemainingBits`                   |                                                                                                                                          |

###### SVC_CHOKE (42)

This message has no fields.

###### SVC_RESOURCELIST (43)

| Name          | Type                        | Description                                         |
|---------------|-----------------------------|-----------------------------------------------------|
| resourceCount | `Bits (12)`                 |                                                     |
| resources     | `Resource` \* resourceCount |                                                     |
| consistencies | `Consistency` \* N          | Continue reading until hasCheckFileFlag is not set. |
|               | `RemainingBits`             |                                                     |

**Resource**

| Name         | Type           | Description                                          |
|--------------|----------------|------------------------------------------------------|
| type         | `Bits (4)`     |                                                      |
| name         | `NullString`   |                                                      |
| index        | `Bits (12)`    |                                                      |
| size         | `Bits (24)`    |                                                      |
| flags        | `Bits (3)`     |                                                      |
| md5Hash      | `? Bits (128)` | Only sent if hasMd5Hash is set in flags (flags & 4). |
| hasExtraInfo | `Bits (1)`     |                                                      |
| extraInfo    | `? Bits (256)` | Only sent if hasExtraInfo is set.                    |

**Consistency**

| Name             | Type                | Description                             |
|------------------|---------------------|-----------------------------------------|
| hasCheckFileFlag | `Flag (Bits (1))`   | Continue reading until this is not set. |
| isShortIndex     | `? Flag (Bits (1))` | Only sent if hasCheckFileFlag is set.   |
| shortIndex       | `? Bits (5)`        | Only sent if isShortIndex is set.       |
| longIndex        | `? Bits (10)`       | Only sent if isShortIndex is not set.   |

###### SVC_NEWMOVEVARS (44)

Note that skyName is not in the same position as in MoveVars.

| Name              | Type            | Description |
|-------------------|-----------------|-------------|
| gravity           | `Float`         |             |
| stopSpeed         | `Float`         |             |
| maxSpeed          | `Float`         |             |
| spectatorMaxSpeed | `Float`         |             |
| accelerate        | `Float`         |             |
| airAccelerate     | `Float`         |             |
| waterAccelerate   | `Float`         |             |
| friction          | `Float`         |             |
| edgeFriction      | `Float`         |             |
| waterFriction     | `Float`         |             |
| entGravity        | `Float`         |             |
| bounce            | `Float`         |             |
| stepSize          | `Float`         |             |
| maxVelocity       | `Float`         |             |
| zMax              | `Float`         |             |
| waveHeight        | `Float`         |             |
| footsteps         | `Flag (Int32)`  |             |
| rollAngle         | `Float`         |             |
| rollSpeed         | `Float`         |             |
| skyColor          | `Float` \* 3    |             |
| skyVec            | `Point (Float)` |             |
| skyName           | `NullString`    |             |

###### SVC_RESOURCEREQUEST (45)

| Name       | Type         | Description |
|------------|--------------|-------------|
| spawnCount | `Int32`      |             |
| _unknown_  | `Word8` \* 4 |             |

###### SVC_CUSTOMIZATION (46)

| Name         | Type            | Description                                         |
|--------------|-----------------|-----------------------------------------------------|
| playerIndex  | `Word8`         |                                                     |
| type         | `Word8`         |                                                     |
| name         | `NullString`    |                                                     |
| index        | `Word16`        |                                                     |
| downloadSize | `Word32`        |                                                     |
| flags        | `Word8`         |                                                     |
| md5Hash      | `? Word8` \* 16 | Only set if hasMd5Hash is set in flags (flags & 4). |

###### SVC_CROSSHAIRANGLE (47)

| Name  | Type    | Description |
|-------|---------|-------------|
| pitch | `Int16` |             |
| yaw   | `Int16` |             |

###### SVC_SOUNDFADE (48)

| Name           | Type    | Description |
|----------------|---------|-------------|
| initialPercent | `Word8` |             |
| holdTime       | `Word8` |             |
| fadeOutTime    | `Word8` |             |
| fadeInTime     | `Word8` |             |

###### SVC_FILETXFERFAILED (49)

| Name     | Type         | Description |
|----------|--------------|-------------|
| filename | `NullString` |             |

###### SVC_HLTV (50)

| Name | Type    | Description               |
|------|---------|---------------------------|
| mode | `Word8` | Expected to be in [0, 2]. |

<!-- TODO Add type mapping -->

###### SVC_DIRECTOR (51)

| Name    | Type             | Description |
|---------|------------------|-------------|
| length  | `Word8`          |             |
| message | `length * Word8` |             |

###### SVC_VOICEINIT (52)

| Name      | Type         | Description |
|-----------|--------------|-------------|
| codecName | `NullString` |             |
| quality   | `Int8`       |             |

###### SVC_VOICEDATA (53)

| Name        | Type            | Description |
|-------------|-----------------|-------------|
| playerIndex | `Word8`         |             |
| size        | `Word16`        |             |
| data        | `Word8` \* size |             |

###### SVC_SENDEXTRAINFO (54)

| Name        | Type         | Description |
|-------------|--------------|-------------|
| fallbackDir | `NullString` |             |
| canCheat    | `Word8`      |             |

###### SVC_TIMESCALE (55)

| Name      | Type    | Description |
|-----------|---------|-------------|
| timeScale | `Float` |             |

###### SVC_RESOURCELOCATION (56)

| Name        | Type         | Description |
|-------------|--------------|-------------|
| downloadUrl | `NullString` |             |

###### SVC_SENDCVARVALUE (57)

_Deprecated_

| Name | Type         | Description |
|------|--------------|-------------|
| name | `NullString` |             |

###### SVC_SENDCVARVALUE2 (58)

| Name      | Type         | Description |
|-----------|--------------|-------------|
| requestId | `Word32`     |             |
| name      | `NullString` |             |

## Changelog

v5.1.1 (2024-04-20)

- Fix byte layout of SVC_DIRECTOR message.
- Improve documentation of SVC_CLIENTDATA to include caveats for HLTV demos.
- Improve documentation for reading demos from a crashed client.
- Use semantic versioning for documentation changelog.

v5.1.0 (2022-12-30)

- Moved file to `docs/demo-structure.md`.

v5.0.0 (2022-01-26)

- Removed TE\_ temp entities from toc.

---

v4.0.0 (2022-01-25)

- Condensed `NetworkMessagesInfo` into `NetworkMessages`.

---

v3.0.0 (2022-01-21)

- Formatting changes.

---

v2.0.0 (2022-01-21)

- Change to less verbose type names.
- Added all the individual frame data.

---

v1.0.0 (2021-08-09)

- First draft.
