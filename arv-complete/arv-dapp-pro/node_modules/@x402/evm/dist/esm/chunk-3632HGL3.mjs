// src/batch-settlement/storage-utils.ts
import { mkdir, readFile, rename, unlink, writeFile } from "fs/promises";
import { dirname, join, resolve, sep } from "path";
function resolveWithinDir(baseDir, filename) {
  const base = resolve(baseDir);
  const target = resolve(base, filename);
  if (target !== base && !target.startsWith(base + sep)) {
    throw new Error("resolved channel path escapes storage root");
  }
  return target;
}
function isNodeEnoent(err) {
  if (!err || typeof err !== "object" || !("code" in err)) return false;
  return err.code === "ENOENT";
}
async function readJsonFile(filePath) {
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    if (isNodeEnoent(err)) return void 0;
    throw err;
  }
}
async function writeJsonAtomic(filePath, value) {
  const dir = dirname(filePath);
  await mkdir(dir, { recursive: true });
  const tmp = join(dir, `.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2)}.tmp`);
  const body = `${JSON.stringify(value, null, 2)}
`;
  await writeFile(tmp, body, "utf8");
  try {
    await rename(tmp, filePath);
  } catch {
    await unlink(filePath).catch(() => {
    });
    await rename(tmp, filePath);
  }
}

export {
  resolveWithinDir,
  isNodeEnoent,
  readJsonFile,
  writeJsonAtomic
};
//# sourceMappingURL=chunk-3632HGL3.mjs.map