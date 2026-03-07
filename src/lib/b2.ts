import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const endpoint = process.env.B2_ENDPOINT ?? "https://s3.us-west-004.backblazeb2.com";
const region = process.env.B2_REGION ?? "us-west-004";
const bucket = process.env.B2_BUCKET_NAME ?? "";
const keyId = process.env.B2_APPLICATION_KEY_ID ?? "";
const appKey = process.env.B2_APPLICATION_KEY ?? "";

let client: S3Client | null = null;

function getClient(): S3Client {
  if (!client) {
    if (!keyId || !appKey) {
      throw new Error("B2_APPLICATION_KEY_ID and B2_APPLICATION_KEY must be set");
    }
    client = new S3Client({
      endpoint,
      region,
      credentials: {
        accessKeyId: keyId,
        secretAccessKey: appKey,
      },
    });
  }
  return client;
}

/**
 * Upload a file to Backblaze B2. Returns the public URL.
 * Bucket must be created and set to public in B2 console.
 * Public URL format: https://<bucket>.s3.<region>.backblazeb2.com/<key>
 */
export async function uploadToB2(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  if (!bucket) throw new Error("B2_BUCKET_NAME must be set");

  const s3 = getClient();
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  // Public URL when bucket has public read
  const baseUrl = `https://${bucket}.s3.${region}.backblazeb2.com`;
  return `${baseUrl}/${key}`;
}

export function isB2Configured(): boolean {
  return !!(keyId && appKey && bucket);
}
