‼️  If you're looking for the demo file documentation, it is located [here](docs/demo-structure.md). ‼️

# @cgdangelo/talent-parser-goldsrc

Parser combinators and utilities for GoldSrc demo files.

## Installation

`@cgdangelo/talent-parser-goldsrc` is published to NPM. Install with your package manager (pnpm, npm, yarn) of choice:
```
npm install @cgdangelo/talent-parser-goldsrc
```

## Usage

### Creating and running a parser

```ts
import { readFile } from "fs/promises";
import { parseDemo } from "@cgdangelo/talent-parser-goldsrc";

const fileContents = await readFile('./demo.dem');
const demo = parseDemo(fileContents); // Demo | undefined
```

### Real-time event access

Demos take quite a while to process, and the final parse result is not exactly tiny. A 20-minute demo can represent several hundred megabytes of JSON data.

To alleviate this, the parser combinator allows for an event bus implementation to be provided so that data can be emitted as the file is evaluated, instead of waiting for the full parsing to complete.

See [`@cgdangelo/talent-demo-analyzer` application](../../apps/example-demo-analyzer/src/index.ts) for more.

```ts
import { EventEmitter } from "events";
import { readFile } from "fs/promises";
import { parseDemo } from "@cgdangelo/talent-parser-goldsrc";

const demoEvents = new EventEmitter();

demoEvents.on('demo:frame', frame => console.log(frame));

const fileContents = await readFile('./demo.dem');

parseDemo(fileContents, demoEvents);
```

### Note for fp-ts users

If you are working on a project within the [fp-ts](https://github.com/gcanti/fp-ts) ecosystem, `@cgdangelo/talent-parser-goldsrc` exports a `demo` combinator constructor built with [parser-ts](https://github.com/gcanti/parser-ts). You should be able to use the combinator in your application the same way this library does.

See [`@cgdangelo/talent-demo-to-json` application](../../apps/jsonify-demo/src/index.ts) for more.

Similarly, the `goldsrcParserIO` and `goldsrcParserEither` constructors return instances that you can manipulate with `IO.map`, `Either.chain`, and so on.
