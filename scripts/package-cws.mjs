#!/usr/bin/env node
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const rootDir = process.cwd();
const packageJson = JSON.parse(await readFile(path.join(rootDir, "package.json"), "utf8"));
const distDir = path.resolve(rootDir, readOption("--dist") ?? "dist");
const outputPath = path.resolve(
  readOption("--out") ?? process.env.CWS_ZIP_PATH ?? `/tmp/${packageJson.name}-${packageJson.version}-cws.zip`
);

const dosTime = 0;
const dosDate = (1 << 5) | 1; // 1980-01-01
const crcTable = createCrcTable();

const files = await collectFiles(distDir);

if (!files.some((file) => file.name === "manifest.json")) {
  fail(`Missing manifest.json at ZIP root. Run npm run build before packaging.`);
}

const archive = await createZip(files);
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, archive);

console.log(`Created ${outputPath}`);
console.log(`${files.length} files, ${archive.length} bytes`);
for (const file of files) {
  console.log(`- ${file.name}`);
}

function readOption(name) {
  const index = process.argv.indexOf(name);
  if (index >= 0) {
    return process.argv[index + 1];
  }

  const prefixed = process.argv.find((arg) => arg.startsWith(`${name}=`));
  return prefixed?.slice(name.length + 1);
}

async function collectFiles(directory) {
  const collected = [];

  async function walk(currentDirectory) {
    const entries = await readdir(currentDirectory, { withFileTypes: true });

    for (const entry of entries) {
      const absolutePath = path.join(currentDirectory, entry.name);
      const relativeName = path.relative(directory, absolutePath).split(path.sep).join("/");

      if (shouldSkip(relativeName)) {
        continue;
      }

      if (entry.isDirectory()) {
        await walk(absolutePath);
        continue;
      }

      if (entry.isFile()) {
        collected.push({
          absolutePath,
          name: relativeName
        });
      }
    }
  }

  await walk(directory);
  return collected.sort((left, right) => left.name.localeCompare(right.name));
}

function shouldSkip(relativeName) {
  const parts = relativeName.split("/");
  return parts.includes("__MACOSX") || parts.includes(".DS_Store");
}

async function createZip(zipFiles) {
  const localRecords = [];
  const centralRecords = [];
  let offset = 0;

  for (const file of zipFiles) {
    const nameBuffer = Buffer.from(file.name, "utf8");
    const data = await readFile(file.absolutePath);
    const crc = crc32(data);
    const localHeader = createLocalHeader(nameBuffer, data.length, crc);
    const centralHeader = createCentralHeader(nameBuffer, data.length, crc, offset);

    localRecords.push(localHeader, nameBuffer, data);
    centralRecords.push(centralHeader, nameBuffer);
    offset += localHeader.length + nameBuffer.length + data.length;
  }

  const centralDirectoryOffset = offset;
  const centralDirectorySize = centralRecords.reduce((size, record) => size + record.length, 0);
  const endRecord = createEndRecord(zipFiles.length, centralDirectorySize, centralDirectoryOffset);

  return Buffer.concat([...localRecords, ...centralRecords, endRecord]);
}

function createLocalHeader(nameBuffer, size, crc) {
  const header = Buffer.alloc(30);
  header.writeUInt32LE(0x04034b50, 0);
  header.writeUInt16LE(20, 4);
  header.writeUInt16LE(0x0800, 6);
  header.writeUInt16LE(0, 8);
  header.writeUInt16LE(dosTime, 10);
  header.writeUInt16LE(dosDate, 12);
  header.writeUInt32LE(crc, 14);
  header.writeUInt32LE(size, 18);
  header.writeUInt32LE(size, 22);
  header.writeUInt16LE(nameBuffer.length, 26);
  header.writeUInt16LE(0, 28);
  return header;
}

function createCentralHeader(nameBuffer, size, crc, localHeaderOffset) {
  const header = Buffer.alloc(46);
  header.writeUInt32LE(0x02014b50, 0);
  header.writeUInt16LE(20, 4);
  header.writeUInt16LE(20, 6);
  header.writeUInt16LE(0x0800, 8);
  header.writeUInt16LE(0, 10);
  header.writeUInt16LE(dosTime, 12);
  header.writeUInt16LE(dosDate, 14);
  header.writeUInt32LE(crc, 16);
  header.writeUInt32LE(size, 20);
  header.writeUInt32LE(size, 24);
  header.writeUInt16LE(nameBuffer.length, 28);
  header.writeUInt16LE(0, 30);
  header.writeUInt16LE(0, 32);
  header.writeUInt16LE(0, 34);
  header.writeUInt16LE(0, 36);
  header.writeUInt32LE(0, 38);
  header.writeUInt32LE(localHeaderOffset, 42);
  return header;
}

function createEndRecord(entryCount, centralDirectorySize, centralDirectoryOffset) {
  const record = Buffer.alloc(22);
  record.writeUInt32LE(0x06054b50, 0);
  record.writeUInt16LE(0, 4);
  record.writeUInt16LE(0, 6);
  record.writeUInt16LE(entryCount, 8);
  record.writeUInt16LE(entryCount, 10);
  record.writeUInt32LE(centralDirectorySize, 12);
  record.writeUInt32LE(centralDirectoryOffset, 16);
  record.writeUInt16LE(0, 20);
  return record;
}

function crc32(buffer) {
  let crc = 0xffffffff;

  for (const byte of buffer) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ byte) & 0xff];
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function createCrcTable() {
  const table = new Uint32Array(256);

  for (let index = 0; index < table.length; index += 1) {
    let value = index;

    for (let bit = 0; bit < 8; bit += 1) {
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }

    table[index] = value >>> 0;
  }

  return table;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
