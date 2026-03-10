import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accountId = process.env.R2_ACCOUNT_ID ?? "";
const endpoint = accountId
  ? `https://${accountId}.r2.cloudflarestorage.com`
  : "";
const bucket = process.env.R2_BUCKET_NAME ?? "";
const accessKeyId = process.env.R2_ACCESS_KEY_ID ?? "";
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY ?? "";
const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL ?? ""; // e.g. https://pub-xxx.r2.dev or https://files.theluminart.com

let client: S3Client | null = null;

function getClient(): S3Client {
  if (!client) {
    if (!accessKeyId || !secretAccessKey) {
      throw new Error("R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY must be set");
    }
    client = new S3Client({
      region: "auto",
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }
  return client;
}

/**
 * Upload a file to Cloudflare R2. Returns the public URL.
 * Enable public access on the bucket (r2.dev or custom domain) and set R2_PUBLIC_BASE_URL.
 */
export async function uploadToR2(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  if (!bucket) throw new Error("R2_BUCKET_NAME must be set");
  if (!publicBaseUrl)
    throw new Error("R2_PUBLIC_BASE_URL must be set for public URLs");

  const s3 = getClient();
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  return `${publicBaseUrl.replace(/\/$/, "")}/${key}`;
}

export function isR2Configured(): boolean {
  return !!(accessKeyId && secretAccessKey && bucket && accountId);
}

/**
 * Generate a presigned PUT URL for direct upload to R2.
 * Client uploads the file directly to R2, bypassing Vercel's 4.5MB body limit.
 */
export async function createPresignedUploadUrl(
  key: string,
  contentType: string
): Promise<{ uploadUrl: string; publicUrl: string }> {
  if (!bucket) throw new Error("R2_BUCKET_NAME must be set");
  if (!publicBaseUrl)
    throw new Error("R2_PUBLIC_BASE_URL must be set for public URLs");

  const s3 = getClient();
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
  const base = publicBaseUrl.replace(/\/$/, "");
  const publicUrl = `${base}/${key}`;

  return { uploadUrl, publicUrl };
}

export type R2Object = { key: string; size: number; lastModified?: Date };

/**
 * List objects in the R2 bucket, optionally filtered by prefix.
 */
export async function listR2Objects(prefix?: string): Promise<R2Object[]> {
  if (!bucket) throw new Error("R2_BUCKET_NAME must be set");
  const s3 = getClient();
  const results: R2Object[] = [];
  let continuationToken: string | undefined;

  do {
    const res = await s3.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix || undefined,
        ContinuationToken: continuationToken,
      })
    );

    for (const obj of res.Contents ?? []) {
      if (obj.Key) {
        results.push({
          key: obj.Key,
          size: obj.Size ?? 0,
          lastModified: obj.LastModified,
        });
      }
    }
    continuationToken = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (continuationToken);

  return results;
}

/**
 * Delete an object from R2 by key.
 */
export async function deleteR2Object(key: string): Promise<void> {
  if (!bucket) throw new Error("R2_BUCKET_NAME must be set");
  const s3 = getClient();
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

/**
 * Get the base public URL for the bucket (no trailing slash).
 */
export function getR2PublicBaseUrl(): string {
  return publicBaseUrl.replace(/\/$/, "");
}

/**
 * Convert a stored URL to R2 object key if it belongs to this bucket's public URL.
 */
export function urlToR2Key(url: string): string | null {
  if (!url || typeof url !== "string" || !url.startsWith("http")) return null;
  const base = getR2PublicBaseUrl();
  if (!base || !url.startsWith(base)) return null;
  const key = url.slice(base.length).replace(/^\//, "");
  return key || null;
}
