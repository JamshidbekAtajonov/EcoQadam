import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { StorageAdapter } from "@/lib/storage/types";

export class LocalStorageAdapter implements StorageAdapter {
  private readonly root = path.resolve(
    /* turbopackIgnore: true */ process.cwd(),
    process.env.LOCAL_STORAGE_DIR ?? "storage/uploads",
  );

  async save(input: { bytes: Uint8Array; filename: string; mimeType: string }) {
    await mkdir(this.root, { recursive: true });
    const extension = path.extname(input.filename).toLowerCase().replace(/[^.a-z0-9]/g, "").slice(0, 8);
    const key = `${randomUUID()}${extension}`;
    await writeFile(path.join(this.root, key), input.bytes);
    return { key, url: `/api/files/${key}`, filename: input.filename, mimeType: input.mimeType, size: input.bytes.byteLength };
  }

  async read(key: string) {
    const safeKey = path.basename(key);
    if (safeKey !== key) throw new Error("Invalid storage key");
    return { bytes: await readFile(path.join(this.root, safeKey)), mimeType: mimeTypeFromKey(safeKey) };
  }
}

function mimeTypeFromKey(key: string) {
  if (key.endsWith(".png")) return "image/png";
  if (key.endsWith(".webp")) return "image/webp";
  if (key.endsWith(".gif")) return "image/gif";
  return "image/jpeg";
}
