#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { inflateRawSync } from "node:zlib";

const rootDir = process.cwd();
const packageJson = JSON.parse(await readFile(path.join(rootDir, "package.json"), "utf8"));
const zipPath = path.resolve(
  readOption("--zip") ?? process.env.CWS_ZIP_PATH ?? `/tmp/${packageJson.name}-${packageJson.version}-cws.zip`
);
const zipBuffer = await readFile(zipPath);
const entries = readCentralDirectory(zipBuffer).filter((entry) => !entry.name.endsWith("/"));
const names = entries.map((entry) => entry.name);
const errors = [];

checkPathSafety(names);
checkRequiredEntries(names);
checkForbiddenEntries(names);
checkManifest(zipBuffer, entries);

if (errors.length > 0) {
  console.error(`Chrome Web Store ZIP verification failed: ${zipPath}`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Chrome Web Store ZIP verification passed: ${zipPath}`);
console.log(`${names.length} files`);
for (const name of names) {
  console.log(`- ${name}`);
}

function readOption(name) {
  const index = process.argv.indexOf(name);
  if (index >= 0) {
    return process.argv[index + 1];
  }

  const prefixed = process.argv.find((arg) => arg.startsWith(`${name}=`));
  return prefixed?.slice(name.length + 1);
}

function readCentralDirectory(buffer) {
  const endOffset = findEndOfCentralDirectory(buffer);
  const entryCount = buffer.readUInt16LE(endOffset + 10);
  const centralDirectoryOffset = buffer.readUInt32LE(endOffset + 16);
  const entries = [];
  let offset = centralDirectoryOffset;

  for (let index = 0; index < entryCount; index += 1) {
    if (buffer.readUInt32LE(offset) !== 0x02014b50) {
      throw new Error(`Invalid central directory header at offset ${offset}.`);
    }

    const compressionMethod = buffer.readUInt16LE(offset + 10);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const uncompressedSize = buffer.readUInt32LE(offset + 24);
    const fileNameLength = buffer.readUInt16LE(offset + 28);
    const extraFieldLength = buffer.readUInt16LE(offset + 30);
    const fileCommentLength = buffer.readUInt16LE(offset + 32);
    const localHeaderOffset = buffer.readUInt32LE(offset + 42);
    const nameStart = offset + 46;
    const name = buffer.subarray(nameStart, nameStart + fileNameLength).toString("utf8");

    entries.push({
      compressedSize,
      compressionMethod,
      localHeaderOffset,
      name,
      uncompressedSize
    });

    offset = nameStart + fileNameLength + extraFieldLength + fileCommentLength;
  }

  return entries;
}

function findEndOfCentralDirectory(buffer) {
  const minimumOffset = Math.max(0, buffer.length - 22 - 0xffff);

  for (let offset = buffer.length - 22; offset >= minimumOffset; offset -= 1) {
    if (buffer.readUInt32LE(offset) === 0x06054b50) {
      return offset;
    }
  }

  throw new Error("Could not find ZIP end of central directory.");
}

function checkPathSafety(entryNames) {
  for (const name of entryNames) {
    if (name.startsWith("/") || name.includes("\\") || name.split("/").includes("..")) {
      errors.push(`Unsafe ZIP entry path: ${name}`);
    }
  }
}

function checkRequiredEntries(entryNames) {
  const requiredEntries = [
    "manifest.json",
    "background/service-worker.js",
    "content/inject.js",
    "_locales/en/messages.json",
    "_locales/ko/messages.json",
    "_locales/ja/messages.json",
    "_locales/zh_CN/messages.json",
    "icons/crop-16.png",
    "icons/crop-32.png",
    "icons/crop-48.png",
    "icons/crop-128.png"
  ];

  for (const requiredEntry of requiredEntries) {
    if (!entryNames.includes(requiredEntry)) {
      errors.push(`Missing required ZIP entry: ${requiredEntry}`);
    }
  }
}

function checkForbiddenEntries(entryNames) {
  const forbiddenRootFiles = [
    /^README(?:\..*)?$/i,
    /^PRIVACY\.md$/i,
    /^NOTICE$/i,
    /^THIRD_PARTY\.md$/i,
    /^LICENSE.*$/i,
    /^package(?:-lock)?\.json$/i,
    /^vite\.config\.[cm]?[jt]s$/i,
    /^tsconfig.*\.json$/i
  ];

  for (const name of entryNames) {
    const parts = name.split("/");
    const rootName = parts[0];

    if (parts.includes(".DS_Store") || parts.includes("__MACOSX")) {
      errors.push(`Forbidden macOS metadata entry: ${name}`);
    }

    if (parts.includes("node_modules") || parts.includes("mydocs")) {
      errors.push(`Forbidden repository/dependency entry: ${name}`);
    }

    if (parts.length === 1 && forbiddenRootFiles.some((pattern) => pattern.test(rootName))) {
      errors.push(`Forbidden repository root file: ${name}`);
    }
  }
}

function checkManifest(buffer, zipEntries) {
  const manifestEntry = zipEntries.find((entry) => entry.name === "manifest.json");

  if (!manifestEntry) {
    errors.push("Missing root manifest.json.");
    return;
  }

  let manifest;

  try {
    manifest = JSON.parse(extractEntry(buffer, manifestEntry).toString("utf8"));
  } catch (error) {
    errors.push(`Could not parse manifest.json: ${error instanceof Error ? error.message : String(error)}`);
    return;
  }

  const allowedPermissions = new Set(["activeTab", "scripting", "clipboardWrite", "downloads"]);
  const permissions = Array.isArray(manifest.permissions) ? manifest.permissions : [];
  const optionalPermissions = Array.isArray(manifest.optional_permissions) ? manifest.optional_permissions : [];
  const hostPermissions = Array.isArray(manifest.host_permissions) ? manifest.host_permissions : [];
  const optionalHostPermissions = Array.isArray(manifest.optional_host_permissions)
    ? manifest.optional_host_permissions
    : [];

  for (const permission of permissions) {
    if (!allowedPermissions.has(permission)) {
      errors.push(`Unexpected manifest permission: ${permission}`);
    }
  }

  for (const permission of optionalPermissions) {
    if (permission === "debugger" || permission === "tabs" || permission === "<all_urls>") {
      errors.push(`Unexpected optional manifest permission: ${permission}`);
    }
  }

  for (const hostPermission of hostPermissions) {
    errors.push(`Unexpected host_permissions entry: ${hostPermission}`);
  }

  for (const hostPermission of optionalHostPermissions) {
    if (isBroadHostPermission(hostPermission)) {
      errors.push(`Unexpected broad optional_host_permissions entry: ${hostPermission}`);
    }
  }
}

function extractEntry(buffer, entry) {
  const localHeaderOffset = entry.localHeaderOffset;

  if (buffer.readUInt32LE(localHeaderOffset) !== 0x04034b50) {
    throw new Error(`Invalid local file header for ${entry.name}.`);
  }

  const fileNameLength = buffer.readUInt16LE(localHeaderOffset + 26);
  const extraFieldLength = buffer.readUInt16LE(localHeaderOffset + 28);
  const dataStart = localHeaderOffset + 30 + fileNameLength + extraFieldLength;
  const dataEnd = dataStart + entry.compressedSize;
  const compressedData = buffer.subarray(dataStart, dataEnd);

  if (entry.compressionMethod === 0) {
    return compressedData;
  }

  if (entry.compressionMethod === 8) {
    return inflateRawSync(compressedData);
  }

  throw new Error(`Unsupported compression method ${entry.compressionMethod} for ${entry.name}.`);
}

function isBroadHostPermission(value) {
  return value === "<all_urls>" || value === "*://*/*" || value === "http://*/*" || value === "https://*/*";
}
