import { type DemoHeader } from './DemoHeader';
import { type DirectoryEntry } from './DirectoryEntry';
import { type Frame } from './frame/Frame';
import { type EngineMessage } from './frame/networkMessages/EngineMessage';
import { type UserMessage } from './frame/networkMessages/UserMessage';

/**
 * Event bus for demo parser.
 */
export interface IDemoEventEmitter {
  /**
   * Emitted when parsing has begun.
   *
   * @param eventName - The name of the event.
   * @param listener - The callback function.
   */
  on(eventName: 'demo:start', listener: () => void): this;

  /**
   * Emitted when a demo header has been parsed.
   *
   * @see {@link DemoHeader}
   * @param eventName - The name of the event.
   * @param listener - The callback function.
   */
  on(eventName: 'demo:header', listener: (demoHeader: DemoHeader) => void): this;

  /**
   * Emitted when directory entry, but not its frames, has been parsed.
   *
   * @see {@link DirectoryEntry}
   * @param eventName - The name of the event.
   * @param listener - The callback function.
   */
  on(
    eventName: 'demo:directory-entry',
    listener: (directoryEntry: DirectoryEntry & { frames: never[] }) => void
  ): this;

  /**
   * Emitted when a frame in a directory entry has been parsed.
   *
   * @see {@link Frame}
   * @param eventName - The name of the event.
   * @param listener - The callback function.
   */
  on(eventName: 'demo:frame', listener: (frame: Frame) => void): this;

  /**
   * Emitted when an engine message in a NetworkMessages frame has been parsed.
   *
   * @see {@link EngineMessage}
   * @param eventName - The name of the event.
   * @param listener - The callback function.
   */
  on(eventName: 'demo:netmessage:engine', listener: (engineMessage: EngineMessage) => void): this;

  /**
   * Emitted when a user message in a NetworkMessages frame has been parsed.
   *
   * @see {@link UserMessage}
   * @param eventName - The name of the event.
   * @param listener - The callback function.
   */
  on(eventName: 'demo:netmessage:user', listener: (userMessage: UserMessage) => void): this;

  /**
   * Emitted when parsing has finished.
   *
   * @param eventName - The name of the event.
   * @param listener - The callback function.
   */
  on(eventName: 'demo:end', listener: () => void): this;

  off(eventName: 'demo:start', listener: () => void): this;

  off(eventName: 'demo:header', listener: (demoHeader: DemoHeader) => void): this;

  off(
    eventName: 'demo:directory-entry',
    listener: (directoryEntry: DirectoryEntry & { frames: never[] }) => void
  ): this;

  off(eventName: 'demo:frame', listener: (frame: Frame) => void): this;

  off(eventName: 'demo:netmessage:engine', listener: (engineMessage: EngineMessage) => void): this;

  off(eventName: 'demo:netmessage:user', listener: (userMessage: UserMessage) => void): this;

  off(eventName: 'demo:end', listener: () => void): this;

  /** @internal */ emit(eventName: 'demo:start', ...args: never[]): unknown;

  /** @internal */ emit(eventName: 'demo:header', ...args: [DemoHeader]): unknown;

  /** @internal */ emit(eventName: 'demo:directory-entry', ...args: [DirectoryEntry]): unknown;

  /** @internal */ emit(eventName: 'demo:frame', ...args: [Frame]): unknown;

  /** @internal */ emit(eventName: 'demo:netmessage:engine', ...args: [EngineMessage]): unknown;

  /** @internal */ emit(eventName: 'demo:netmessage:user', ...args: [UserMessage]): unknown;

  /** @internal */ emit(eventName: 'demo:end', ...args: never[]): unknown;
}
