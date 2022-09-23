import environment, { ENV_KEY } from "@/env";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const env = environment();
const bucketName = env.get(ENV_KEY.AWS_S3_PRIVATE_BUCKET_NAME);

/**
 * プライベートなバケットのファイルを参照する署名付きURLを取得します。
 */
const getObjectByPrivateBucket = async (
  client: S3Client,
  objectKey: string
) => {
  if (!bucketName) {
    throw new Error("バケット名が設定されていません");
  }
  const expiresIn = Number(env.get(ENV_KEY.AWS_SIGNED_URL_EXPIRE_SECOND));
  if (Number.isNaN(expiresIn)) {
    throw new Error("不正な数値です");
  }

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
  });
  return await getSignedUrl(client, command, {
    expiresIn,
  });
};

/**
 * バケットからファイルを削除します
 * @description
 *  - パブリック・プライベートのバケットでコードは同じです
 *  - バケットのバージョニングが有効な場合、削除マーカー有無等で少しコード修正が必要です
 */
const deleteObjectByPrivateBucket = async (
  client: S3Client,
  objectKey: string
): Promise<boolean> => {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
  });
  const response = await client.send(command);
  const statusCode = response?.$metadata?.httpStatusCode;

  return Number(statusCode) <= 200 && Number(statusCode) < 300;
};

/**
 * バケットにファイルをアップロードします
 * @description
 *  - パブリック・プライベートのバケットでコードは同じです
 */
const putObjectByPrivateBucket = async (
  client: S3Client,
  objectKey: string,
  file: Buffer
): Promise<boolean> => {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
    Body: file,
    Tagging: `Key1=Value1&Key2=Value2`,
  });
  const response = await client.send(command);
  const statusCode = response?.$metadata?.httpStatusCode;

  return Number(statusCode) <= 200 && Number(statusCode) < 300;
};

export {
  getObjectByPrivateBucket,
  deleteObjectByPrivateBucket,
  putObjectByPrivateBucket,
};
