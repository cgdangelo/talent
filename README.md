# Talent

~~A framework for identifying hype.~~ Maybe someday. :smile:

For now: yet another GoldSrc parser, built with [fp-ts](https://github.com/gcanti/fp-ts/), and some utilities built on top of it!

## Packages

### Applications

| Name | Description | On npm? |
| --- | --- | --- |
| [@cgdangelo/talent-jsonify-demo](https://github.com/cgdangelo/talent/tree/main/apps/jsonify-demo) | Runs the demo parser and logs to console. | ✅ |
| [@cgdangelo/talent-demo-renamer](https://github.com/cgdangelo/talent/tree/main/apps/demo-renamer) | Renames a list of demo files to `YYYY-MM-DD_HHMM_{map}.dem`. | |
| [@cgdangelo/talent-example-demo-analyzer](https://github.com/cgdangelo/talent/tree/main/apps/example-demo-analyzer) | Example of a real-time demo analysis application using the demo parser event bus. | |

### Libraries

| Name | Description | On npm? |
| --- | --- | --- |
| [@cgdangelo/talent-parser-goldsrc](https://github.com/cgdangelo/talent/tree/main/libraries/parser-goldsrc) | Parser combinators for a GoldSrc demo file. | ✅ |
| [@cgdangelo/talent-parser-bitbuffer](https://github.com/cgdangelo/talent/tree/main/libraries/parser-bitbuffer) | Parser combinators for bit-packed fields. | ✅ |
| [@cgdangelo/talent-parser-buffer](https://github.com/cgdangelo/talent/tree/main/libraries/parser-buffer) | Parser combinators for a [Buffer](https://nodejs.org/api/buffer.html). | ✅ |
| [@cgdangelo/talent-parser](https://github.com/cgdangelo/talent/tree/main/libraries/parser) | General use parser combinators. | ✅ |
| [@cgdangelo/talent-observable](https://github.com/cgdangelo/talent/tree/main/libraries/observable) | fp-ts bindings for rxjs observables. | |

## What's working?

Demos can be parsed in their entirety. This includes all frame types, and all `SVC_` engine messages contained with a `NetworkMessages` frame. User message parsing is limited to returning the message id, name, and raw data. Since the data in a message can vary between mods (e.g., [DeathMsg](https://wiki.alliedmods.net/Half-life_1_game_events#DeathMsg)) these parsers may have to reside in mod-specific packages.

## ~~What's coming?~~ What's maybe coming?

The original goal of this project was to create a GoldSrc demo parser that could translate in-game events into readable data structures and emit them through observables for analysis. In particular, the ability to identify "hype" moments through some set of heuristics, such as:

1.  Multi-kills: Multiple frags at (roughly) the same timestamp, implying only one shot fired.
2.  Fast-paced streaks: multiple frags within a short period of time.
3.  High survivability: High number of frags between spawn and death.
4.  Events leading to a win condition, such as:
    -   (Counter-Strike) Defusing the bomb with enemy players still alive could be a ninja defuse.
    -   (Counter-Strike) Multiple kills in a disadvantaged situation (1v3, 1v4, 1v5) into a bomb defusal. This could be a CT retaking the bomb site and clutching the round.
    -   (Day of Defeat) Multiple kills into a round win. This could be a streak that leads to a cap-out.
5.  Events that are otherwise important because of their circumstances:
    -   (Day of Defeat) Breaking a double cap in progress when the enemy team controls all other flags, thereby preventing a cap-out.
    -   A rapid change in crosshair angles followed by a kill. This could be a flick shot.

## Contributing

This is a monorepo managed by [Rush](https://rushjs.io/). You will need the Rush tool to continue:

```
npm install -g @microsoft/rush
```

### Running applications

```
git clone https://github.com/cgdangelo/talent.git
cd talent
rush update
rush build

node ./apps/<name-of-app>/lib/index.js [app params]
```

## Prior art

-   <https://github.com/vinceau/project-clippi>

    *An automation framework for Super Smash Bros. Melee.*

    The SSBM version of this tool that provided much of my initial inspiration.

## References

-   <https://github.com/YaLTeR/hldemo-rs>

    *Half-Life demo format parser using [nom](https://crates.io/crates/nom).*

    This was the most comprehensive (and readable) source of demo format information that I found and was a great starting point. It also heavily inspired me to refactor the original mess I had into parser combinators ([Parser combinators (#1)](https://github.com/cgdangelo/talent/pull/1)).

-   <https://github.com/jpcy/coldemoplayer>

    *compLexity Demo Player is the official Counter-Strike demo player of compLexity Gaming.*

    Lots of helpful examples of handling edge cases, minor differences in demo file formats, conversion and repair strategies, etc.

-   <https://github.com/skyrim/hlviewer.js>

    *Half-Life in WebGL.*

    Probably the best source of frame data information.

-   <https://wiki.alliedmods.net/Half-Life_1_Engine_Messages>

    Straightforward source of frame data information re: engine messages. Often includes some much needed context alongside the actual structure.

