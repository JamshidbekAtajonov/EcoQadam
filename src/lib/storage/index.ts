import { LocalStorageAdapter } from "@/lib/storage/local";
import type { StorageAdapter } from "@/lib/storage/types";
import { VercelBlobStorageAdapter } from "@/lib/storage/vercel-blob";

const hasVercelBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);

export const storage: StorageAdapter = hasVercelBlob
  ? new VercelBlobStorageAdapter()
  : new LocalStorageAdapter();
