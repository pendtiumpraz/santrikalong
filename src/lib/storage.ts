// Storage: blob PRIVAT (S3-compatible: Cloudflare R2 / S3 / Wasabi).
// File TIDAK pernah diakses lewat domain blob — selalu di-stream via /media (domain kita).
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  type GetObjectCommandOutput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const endpoint = process.env.STORAGE_ENDPOINT;
const bucket = process.env.STORAGE_BUCKET;

export const storage = new S3Client({
  region: process.env.STORAGE_REGION || "auto",
  endpoint,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.STORAGE_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY || "",
  },
});

export function storageBucket(): string {
  if (!bucket) throw new Error("STORAGE_BUCKET belum di-set (lihat .env.example).");
  return bucket;
}

/** Ambil objek dari bucket privat (dipakai oleh route /media untuk di-stream). */
export function getObject(key: string): Promise<GetObjectCommandOutput> {
  return storage.send(new GetObjectCommand({ Bucket: storageBucket(), Key: key }));
}

/** Signed URL untuk UPLOAD langsung dari klien ke bucket privat (presigned PUT). */
export function presignUpload(key: string, contentType: string, expiresIn = 600) {
  return getSignedUrl(
    storage,
    new PutObjectCommand({ Bucket: storageBucket(), Key: key, ContentType: contentType }),
    { expiresIn }
  );
}
