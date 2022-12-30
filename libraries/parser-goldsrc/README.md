‼️  If you're looking for the demo file documentation, it is located [here](docs/demo-structure.md). ‼️

# @talent/parser-goldsrc

Parser combinators and utilities for GoldSrc demo files.

## Installation

`@talent/parser-goldsrc` is published to NPM. Install with your package manager (pnpm, npm, yarn) of choice:
```
npm install @talent/parser-goldsrc
```

## Usage

### Creating and running a parser

```ts
import { readFile } from "fs/promises";
import { createDemoParserIO } from "@talent/parser-goldsrc";

const fileContents = await readFile('./demo.dem');
const runParser = createDemoParserIO(fileContents);

const demo = runParser(); // Demo | undefined
```

### Real-time event access

Demos take quite a while to process, and the final parse result is not exactly tiny. A 20-minute demo can represent several hundred megabytes of JSON data.

To alleviate this, the parser combinator allows for an event bus implementation to be provided so that data can be emitted as the file is evaluated, instead of waiting for the full parsing to complete.

See [`@talent/demo-analyzer` application](../../apps/demo-analyzer/src/index.ts) for more.

```ts
import { EventEmitter } from "events";
import { readFile } from "fs/promises";
import { createDemoParserIO } from "@talent/parser-goldsrc";

const demoEvents = new EventEmitter();

const fileContents = await readFile('./demo.dem');
const runParser = createDemoParserIO(fileContents, demoEvents);

demoEvents.on('demo:frame', frame => console.log(frame));

runParser();
```

### Note for fp-ts users

If you are working on a project within the [fp-ts](https://github.com/gcanti/fp-ts) ecosystem, `@talent/parser-goldsrc` exports a `demo` combinator built with [parser-ts](https://github.com/gcanti/parser-ts). You should be able to use the combinator in your application the same way this library does.

See [`@talent/demo-to-json` application](../../apps/demo-to-json/src/index.ts) for more.

Similarly, the `createDemoParserIO` factory creates an IO monad that you can manipulate with `IO.map`, `IO.chain`, and so on.
