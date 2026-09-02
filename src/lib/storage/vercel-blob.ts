import path from "node:path";
import { get, put } from "@vercel/blob";
import type { StorageAdapter } from "@/lib/storage/types";

export class VercelBlobStorageAdapter implements StorageAdapter {
  async save(input: { bytes: Uint8Array; filename: string; mimeType: string }) {
    const filename = path.basename(input.filename).replace(/[^a-zA-Z0-9._-]/g, "-") || "evidence.jpg";
    const blob = await put(filename, Buffer.from(input.bytes), {
      access: "private",
      addRandomSuffix: true,
      contentType: input.mimeType,
    });

    return {
      key: blob.pathname,
      url: `/api/files/${encodeURIComponent(blob.pathname)}`,
      filename: input.filename,
      mimeType: blob.contentType,
      size: input.bytes.byteLength,
    };
  }

  async read(key: string) {
    const result = await get(key, { access: "private" });
    if (!result || result.statusCode !== 200) throw new Error("File not found");

    return {
      bytes: new Uint8Array(await new Response(result.stream).arrayBuffer()),
      mimeType: result.blob.contentType,
    };
  }
}
