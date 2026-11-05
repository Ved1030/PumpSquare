import "server-only";
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

type StorageConfig = {
  client: S3Client;
  bucket: string;
  publicBaseUrl: string;
};

let cached: StorageConfig | null = null;

function storageConfig(): StorageConfig {
  if (cached) return cached;

  const { S3_ENDPOINT, S3_REGION, S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_PUBLIC_BASE_URL } =
    process.env;

  if (!S3_BUCKET || !S3_ACCESS_KEY_ID || !S3_SECRET_ACCESS_KEY || !S3_PUBLIC_BASE_URL) {
    throw new Error("File storage is not configured (S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_PUBLIC_BASE_URL).");
  }

  cached = {
    client: new S3Client({
      region: S3_REGION ?? "auto",
      endpoint: S3_ENDPOINT,
      forcePathStyle: Boolean(S3_ENDPOINT),
      credentials: { accessKeyId: S3_ACCESS_KEY_ID, secretAccessKey: S3_SECRET_ACCESS_KEY },
    }),
    bucket: S3_BUCKET,
    publicBaseUrl: S3_PUBLIC_BASE_URL.replace(/\/$/, ""),
  };
  return cached;
}

export async function uploadPublicFile(key: string, body: Buffer, contentType: string) {
  const config = storageConfig();
  await config.client.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
  return `${config.publicBaseUrl}/${key}`;
}

/** Deletes an uploaded file, ignoring anything not owned by our bucket. */
export async function deleteUploadedFile(url: string | null | undefined) {
  if (!url) return;
  const config = storageConfig();
  const prefix = `${config.publicBaseUrl}/`;
  if (!url.startsWith(prefix)) return;

  await config.client.send(
    new DeleteObjectCommand({ Bucket: config.bucket, Key: url.slice(prefix.length) }),
  );
}

/** Public buckets only, so uploaded product media stays readable by visitors. */
export function publicUrlHost() {
  try {
    return new URL(process.env.S3_PUBLIC_BASE_URL ?? "").host;
  } catch {
    return null;
  }
}
