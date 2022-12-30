import { demo, IDemoEventEmitter } from '@talent/parser-goldsrc';
import { EventEmitter } from 'events';
import { PathLike } from 'fs';
import { readFile } from 'fs/promises';

/**
 * @param demoPath - Path to a demo file.
 */
async function main(demoPath?: PathLike): Promise<void> {
  if (!demoPath) {
    throw new Error('No demo path provided.');
  }

  // Load the demo into memory.
  const fileContents = await readFile(demoPath);

  // Create an event bus for the demo parser.
  const demoEvents: IDemoEventEmitter = new EventEmitter();

  // Demo has begun parsing.
  demoEvents.on('demo:start', () => console.log('DemoAnalyzer | Start.'));

  // Protocol version, map and game information has been parsed.
  demoEvents.on('demo:header', (header) => console.log('DemoAnalyzer | Header', header));

  // Directory entry, before frames have been added. Two of these are expected per demo.
  //   demoEvents.on('demo:directory-entry', (directoryEntry) =>
  //     console.log('DemoAnalyzer | Directory entry', directoryEntry)
  //   );

  // Use case: tracking player movement through NetworkMessages.refParams.viewOrigin.
  //   demoEvents.on('demo:frame', (directoryEntry) => console.log('DemoAnalyzer | Frame', directoryEntry));

  // Use case: tracking player name changes through SVC_UPDATEUSERINFO.
  demoEvents.on('demo:netmessage:engine', (message) => console.log('DemoAnalyzer | Engine message', message));

  // Use case: mod events.
  demoEvents.on('demo:netmessage:user', (message) => console.log('DemoAnalyzer | User message', message));

  // Demo has finished parsing.
  demoEvents.on('demo:end', () => console.log('DemoAnalyzer | End.'));

  // Run the parser; the parser will emit events through the `demoEvents` bus as the file is evaluated.
  demo(demoEvents)({ buffer: fileContents as unknown as number[], cursor: 0 });
}

main(process.argv[2]).catch(console.error);
