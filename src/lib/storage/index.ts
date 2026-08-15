import { LocalStorageAdapter } from "@/lib/storage/local";
import type { StorageAdapter } from "@/lib/storage/types";

// Swap this single binding for an S3/R2 adapter without changing route handlers.
export const storage: StorageAdapter = new LocalStorageAdapter();
