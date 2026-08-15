export type StoredFile = {
  key: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
};

export interface StorageAdapter {
  save(input: { bytes: Uint8Array; filename: string; mimeType: string }): Promise<StoredFile>;
  read(key: string): Promise<{ bytes: Uint8Array; mimeType: string }>;
}
