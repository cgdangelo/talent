import { readFile } from "fs/promises";
import { resolve } from "path";

const DEMO_PATH = resolve(__dirname, "../../../demo.dem");
const DIRECTORY_ENTRY_LENGTH =
  4 + // Unknown
  64 + // Title
  8 + // "flags, cdtrack" ?
  12; // "frames, offset and length"

const readString = (buffer: Buffer, cursor = 0, length = 1) =>
  new Array(length)
    .fill(null)
    .map((_, i) => String.fromCharCode(buffer.readInt8(cursor + i)))
    .filter((s) => s !== "\x00")
    .join("");

const readDirectoryEntry = (buffer: Buffer, cursor = 0) => ({
  index: buffer.readInt32LE(cursor),
  title: readString(buffer, cursor + 4, 64),
  time: buffer.readFloatLE(cursor + 4 + 64 + 4 + 4),
});

readFile(DEMO_PATH).then((buffer) => {
  const magic = readString(buffer, 0, 8);

  console.assert(magic !== "HLDEMO", `File is not an HLDEMO: ${magic}`);

  const protocol = buffer.readInt32LE(8);
  const networkProtocol = buffer.readInt32LE(12);
  const mapName = readString(buffer, 13, 260);
  const gameDirectory = readString(buffer, 274, 260);
  const mapChecksum = buffer.readUInt32LE(535);

  // Validate directory entries offset
  const directoryEntriesOffset = buffer.readUInt32LE(540);
  const expectedDirectoryEntriesOffset = buffer.byteLength - 4 - 92 * 2;

  console.assert(
    directoryEntriesOffset === expectedDirectoryEntriesOffset,
    `Directory entries offset did not match expected: ${directoryEntriesOffset} !== ${expectedDirectoryEntriesOffset}`
  );

  // Validate total directory entries
  const totalDirectoryEntries = buffer.readInt32LE(directoryEntriesOffset);

  console.assert(
    totalDirectoryEntries === 2,
    `Number of directory entries larger than expected: ${totalDirectoryEntries}`
  );

  const directoryEntriesStartIndex = directoryEntriesOffset + 4;

  console.log({
    magic,
    protocol,
    networkProtocol,
    mapName,
    gameDirectory,
    mapChecksum,
    directoryEntries: [
      readDirectoryEntry(buffer, directoryEntriesStartIndex),
      readDirectoryEntry(
        buffer,
        directoryEntriesStartIndex + DIRECTORY_ENTRY_LENGTH + 1
      ),
    ],
  });
});
