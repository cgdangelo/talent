# GoldSrc Demo File Format

**Acknowledgments**

Sources for this information include:

- [https://github.com/YaLTeR/hldemo-rs/](https://github.com/YaLTeR/hldemo-rs/)
- [https://github.com/jpcy/coldemoplayer](https://github.com/jpcy/coldemoplayer)

<!-- markdown-toc start - Don't edit this section. Run M-x markdown-toc-refresh-toc -->

**Table of Contents**

- [GoldSrc Demo File Format](#goldsrc-demo-file-format)
  - [Demo](#demo)
  - [Header](#header)
  - [Directory](#directory)
  - [DirectoryEntry](#directoryentry)
  - [Frame](#frame)
    - [Frame type id mapping](#frame-type-id-mapping)
    - [DemoStart](#demostart)
    - [ConsoleCommand](#consolecommand)
    - [ClientData](#clientdata)
    - [NextSection](#nextsection)
    - [WeaponAnimation](#weaponanimation)
    - [Sound](#sound)
    - [DemoBuffer](#demobuffer)
    - [NetMessage](#netmessage)
      - [NetMessageInfo](#netmessageinfo)
        - [RefParams](#refparams)
        - [UserCommand](#usercommand)
        - [MoveVariables](#movevariables)
  - [Changelog](#changelog)

<!-- markdown-toc end -->

---

## Demo

| Name      | Byte length | Type                    | Description                      |
| --------- | ----------- | ----------------------- | -------------------------------- |
| header    | 540         | [Header](#header)       | Metadata about the demo file.    |
| directory | _Varies_    | [Directory](#directory) | Container for the entry "files". |

---

## Header

| Name            | Byte length | Type                    | Description                                        |
| --------------- | ----------- | ----------------------- | -------------------------------------------------- |
| magic           | 8           | null-terminated string  | `HLDEMO` for GoldSrc, `HLDEMO2` for Source.        |
| protocol        | 4           | 32-bit signed integer   | Protocol version of the demo, e.g., `5`.           |
| networkProtocol | 4           | 32-bit signed integer   | Protocol version of the server, e.g., `48`.        |
| mapName         | 260         | null-terminated string  | Name of the server's map, e.g., `cs_docks`.        |
| gameDirectory   | 260         | null-terminated string  | Name of the mod directory, e.g., `dod`, `cstrike`. |
| mapChecksum     | 4           | 32-bit unsigned integer | CRC value for map file.                            |

---

## Directory

| Name    | Byte length | Type                                | Description |
| ------- | ----------- | ----------------------------------- | ----------- |
| entries | _Varies_    | [DirectoryEntry](#directoryentry)[] |             |

---

## DirectoryEntry

_Note that [Frame](#frame) are not adjacent to the directory entry. They are located at the offset described below._

| Name        | Byte length | Type                   | Description                                                                                      |
| ----------- | ----------- | ---------------------- | ------------------------------------------------------------------------------------------------ |
| type        | 4           | 32-bit signed integer  |                                                                                                  |
| description | 64          | null-terminated string | Name of the [DirectoryEntry](#directoryentry).                                                   |
| flags       | 4           | 32-bit signed integer  |                                                                                                  |
| cdTrack     | 4           | 32-bit signed integer  |                                                                                                  |
| trackTime   | 4           | 32-bit floating point  |                                                                                                  |
| frameCount  | 4           | 32-bit signed integer  | Number of [Frame](#frame) contained in the [DirectoryEntry](#directoryentry).                    |
| offset      | 4           | 32-bit signed integer  | Position within the file where [Frame](#frame) for this [DirectoryEntry](#directoryentry) begin. |
| fileLength  | 4           | 32-bit signed integer  | Size, in bytes, of the [DirectoryEntry](#directoryentry).                                        |
| frames      | _Varies_    | [Frame](#frame)[]      | Collection of [Frame](#frame) in the [DirectoryEntry](#directoryentry).                          |

---

## Frame

| Name | Byte length | Type                               | Description                                  |
| ---- | ----------- | ---------------------------------- | -------------------------------------------- |
| type | 1           | 8-bit unsigned integer, big endian | See [Frame type mapping](#frametypemapping). |

### Frame type id mapping

| Type | Frame type                          | Description                                                  |
| ---- | ----------------------------------- | ------------------------------------------------------------ |
| 0    | [NetMessage](#netmessage).Start     | Data from the server.                                        |
| 1    | [NetMessage](#netmessage).Normal    |                                                              |
| 2    | [DemoStart](#demostart)             | First frame in the [Demo](#demo).                            |
| 3    | [ConsoleCommand](#consolecommand)   | A console command executed by the user.                      |
| 4    | [ClientData](#clientdata)           | Client state information?                                    |
| 5    | [NextSection](#nextsection)         | Indicates the [DirectoryEntry](#directoryentry) is finished. |
| 6    | [Event](#event)                     |                                                              |
| 7    | [WeaponAnimation](#weaponanimation) |                                                              |
| 8    | [Sound](#sound)                     |                                                              |
| 9    | [DemoBuffer](#demobuffer)           |                                                              |

### DemoStart

This frame type has no additional data.

### ConsoleCommand

| Name      | Byte length | Type  | Description |
| --------- | ----------- | ----- | ----------- |
| `command` | 64          | bytes |             |

### ClientData

| Name        | Byte length | Type                  | Description               |
| ----------- | ----------- | --------------------- | ------------------------- |
| originX     | 4           | 32-bit floating point |                           |
| originY     | 4           | 32-bit floating point |                           |
| originZ     | 4           | 32-bit floating point |                           |
| viewAnglesX | 4           | 32-bit floating point |                           |
| viewAnglesY | 4           | 32-bit floating point |                           |
| viewAnglesZ | 4           | 32-bit floating point |                           |
| weaponBits  | 4           | 32-bit signed integer |                           |
| fov         | 4           | 32-bit floating point | Field of view in degrees. |

### NextSection

This frame type has no additional data.

### WeaponAnimation

| Name      | Byte length | Type                  | Description |
| --------- | ----------- | --------------------- | ----------- |
| animation | 4           | 32-bit signed integer |             |
| body      | 4           | 32-bit signed integer |             |

### Sound

| Name         | Byte length  | Type                  | Description                                 |
| ------------ | ------------ | --------------------- | ------------------------------------------- |
| channel      | 4            | 32-bit signed integer |                                             |
| sampleLength | 4            | 32-bit signed integer | Length, in bytes, of the sample.            |
| sample       | sampleLength | bytes                 |                                             |
| attenuation  | 4            | 32-bit floating point | Attenuation percentage in the range [0, 1]. |
| volume       | 4            | 32-bit floating point | Volume percentage.                          |
| flags        | 4            | 32-bit signed integer |                                             |
| pitch        | 4            | 32-bit signed integer |                                             |

### DemoBuffer

| Name         | Byte length  | Type                  | Description                                |
| ------------ | ------------ | --------------------- | ------------------------------------------ |
| bufferLength | 4            | 32-bit signed integer | Length, in bytes, of the demo buffer data. |
| buffer       | bufferLength | bytes                 |                                            |

### NetMessage

| Name                         | Byte length | Type                              | Description                                                                          |
| ---------------------------- | ----------- | --------------------------------- | ------------------------------------------------------------------------------------ |
| info                         |             | [NetMessageInfo](#netmessageinfo) |                                                                                      |
| incomingSequence             | 4           | 32-bit signed integer             |                                                                                      |
| incomingAcknowledged         | 4           | 32-bit signed integer             |                                                                                      |
| incomingReliableAcknowledged | 4           | 32-bit signed integer             |                                                                                      |
| incomingReliableSequence     | 4           | 32-bit signed integer             |                                                                                      |
| outgoingSequence             | 4           | 32-bit signed integer             |                                                                                      |
| reliableSequence             | 4           | 32-bit signed integer             |                                                                                      |
| lastReliableSequence         | 4           | 32-bit signed integer             |                                                                                      |
| messageLength                | 4           | 32-bit signed integer             | Length, in bytes, of the message data contained with this [NetMessage](#netmessage). |
| message                      | msgLength   | bytes                             |                                                                                      |

#### NetMessageInfo

| Name          | Byte length | Type                            | Description |
| ------------- | ----------- | ------------------------------- | ----------- |
| timestamp     | 4           | 32-bit floating point           |             |
| refParams     |             | [RefParams](#refparams)         |             |
| userCommand   |             | [UserCommand](#usercommand)     |             |
| moveVariables |             | [MoveVariables](#movevariables) |             |
| viewX         | 4           | 32-bit floating point           |             |
| viewY         | 4           | 32-bit floating point           |             |
| viewZ         | 4           | 32-bit floating point           |             |

##### RefParams

| Name             | Byte length | Type                  | Description |
| ---------------- | ----------- | --------------------- | ----------- |
| viewOriginX      | 4           | 32-bit floating point |             |
| viewOriginY      | 4           | 32-bit floating point |             |
| viewOriginZ      | 4           | 32-bit floating point |             |
| viewAnglesX      | 4           | 32-bit floating point |             |
| viewAnglesY      | 4           | 32-bit floating point |             |
| viewAnglesZ      | 4           | 32-bit floating point |             |
| forwardX         | 4           | 32-bit floating point |             |
| forwardY         | 4           | 32-bit floating point |             |
| forwardZ         | 4           | 32-bit floating point |             |
| rightX           | 4           | 32-bit floating point |             |
| rightY           | 4           | 32-bit floating point |             |
| rightZ           | 4           | 32-bit floating point |             |
| upX              | 4           | 32-bit floating point |             |
| upY              | 4           | 32-bit floating point |             |
| upZ              | 4           | 32-bit floating point |             |
| frameTime        | 4           | 32-bit floating point |             |
| time             | 4           | 32-bit floating point |             |
| intermission     | 4           | 32-bit signed integer | Boolean?    |
| paused           | 4           | 32-bit signed integer | Boolean?    |
| spectator        | 4           | 32-bit signed integer | Boolean?    |
| onGround         | 4           | 32-bit signed integer | Boolean?    |
| waterLevel       | 4           | 32-bit signed integer |             |
| simVelocityX     | 4           | 32-bit floating point |             |
| simVelocityY     | 4           | 32-bit floating point |             |
| simVelocityZ     | 4           | 32-bit floating point |             |
| simOriginX       | 4           | 32-bit floating point |             |
| simOriginY       | 4           | 32-bit floating point |             |
| simOriginZ       | 4           | 32-bit floating point |             |
| viewHeightX      | 4           | 32-bit floating point |             |
| viewHeightY      | 4           | 32-bit floating point |             |
| viewHeightZ      | 4           | 32-bit floating point |             |
| idealPitch       | 4           | 32-bit floating point |             |
| cl_viewanglesX   | 4           | 32-bit floating point |             |
| cl_viewanglesY   | 4           | 32-bit floating point |             |
| cl_viewanglesZ   | 4           | 32-bit floating point |             |
| health           | 4           | 32-bit signed integer |             |
| crosshairAngleX  | 4           | 32-bit floating point |             |
| crosshairAngleY  | 4           | 32-bit floating point |             |
| crosshairAngleZ  | 4           | 32-bit floating point |             |
| viewSize         | 4           | 32-bit floating point |             |
| punchAngleX      | 4           | 32-bit floating point |             |
| punchAngleY      | 4           | 32-bit floating point |             |
| punchAngleZ      | 4           | 32-bit floating point |             |
| maxClients       | 4           | 32-bit signed integer |             |
| viewEntity       | 4           | 32-bit signed integer |             |
| playerNum        | 4           | 32-bit signed integer |             |
| maxEntities      | 4           | 32-bit signed integer |             |
| demoPlayback     | 4           | 32-bit signed integer |             |
| hardware         | 4           | 32-bit signed integer |             |
| smoothing        | 4           | 32-bit signed integer |             |
| ptrCommand       | 4           | 32-bit signed integer |             |
| ptrMoveVariables | 4           | 32-bit signed integer |             |
| viewPortOriginX  | 4           | 32-bit signed integer |             |
| viewPortOriginY  | 4           | 32-bit signed integer |             |
| viewPortWidth    | 4           | 32-bit signed integer |             |
| viewPortHeight   | 4           | 32-bit signed integer |             |
| nextView         | 4           | 32-bit signed integer |             |
| onlyClientDraw   | 4           | 32-bit signed integer | Boolean?    |

##### UserCommand

| Name            | Byte length | Type                               | Description  |
| --------------- | ----------- | ---------------------------------- | ------------ |
| lerpMs          | 2           | 16-bit signed integer              |              |
| ms              | 1           | 8-bit unsigned integer, big endian |              |
| -               | 1           | bytes                              | Empty byte?  |
| viewAnglesX     | 4           | 32-bit floating point              |              |
| viewAnglesY     | 4           | 32-bit floating point              |              |
| viewAnglesZ     | 4           | 32-bit floating point              |              |
| forwardMove     | 4           | 32-bit floating point              |              |
| sideMove        | 4           | 32-bit floating point              |              |
| upMove          | 4           | 32-bit floating point              |              |
| lightLevel      | 1           | 8-bit signed integer, big endian   |              |
| -               | 1           | bytes                              | Empty byte?  |
| buttons         | 2           | 16-bit unsigned integer            |              |
| impulse         | 1           | 8-bit signed integer, big endian   |              |
| weaponSelect    | 1           | 8-bit signed integer, big endian   |              |
| -               | 2           | bytes                              | Empty bytes? |
| impactIndex     | 4           | 32-bit signed integer              |              |
| impactPositionX | 4           | 32-bit floating point              |              |
| impactPositionY | 4           | 32-bit floating point              |              |
| impactPositionZ | 4           | 32-bit floating point              |              |

##### MoveVariables

| Name              | Byte length | Type                   | Description                         |
| ----------------- | ----------- | ---------------------- | ----------------------------------- |
| gravity           | 4           | 32-bit floating point  |                                     |
| stopSpeed         | 4           | 32-bit floating point  |                                     |
| maxSpeed          | 4           | 32-bit floating point  |                                     |
| spectatorMaxSpeed | 4           | 32-bit floating point  |                                     |
| accelerate        | 4           | 32-bit floating point  |                                     |
| airAccelerate     | 4           | 32-bit floating point  |                                     |
| waterAccelerate   | 4           | 32-bit floating point  |                                     |
| friction          | 4           | 32-bit floating point  |                                     |
| edgeFriction      | 4           | 32-bit floating point  |                                     |
| waterFriction     | 4           | 32-bit floating point  |                                     |
| entityGravity     | 4           | 32-bit floating point  |                                     |
| bounce            | 4           | 32-bit floating point  |                                     |
| stepSize          | 4           | 32-bit floating point  |                                     |
| maxVelocity       | 4           | 32-bit floating point  |                                     |
| zMax              | 4           | 32-bit floating point  |                                     |
| waveHeight        | 4           | 32-bit floating point  |                                     |
| footsteps         | 4           | 32-bit signed integer  | Boolean?                            |
| skyName           | 32          | null-terminated string | Name of the skybox, e.g., `desert`. |
| rollAngle         | 4           | 32-bit floating point  |                                     |
| rollSpeed         | 4           | 32-bit floating point  |                                     |
| skyColorX         | 4           | 32-bit floating point  |                                     |
| skyColorY         | 4           | 32-bit floating point  |                                     |
| skyColorZ         | 4           | 32-bit floating point  |                                     |
| skyVectorX        | 4           | 32-bit floating point  |                                     |
| skyVectorY        | 4           | 32-bit floating point  |                                     |
| skyVectorZ        | 4           | 32-bit floating point  |                                     |

## Changelog

**1.0.0 (2021-08-09)**

- First draft.
