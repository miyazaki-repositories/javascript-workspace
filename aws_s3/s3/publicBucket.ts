import environment, { ENV_KEY } from "@/env";
import {
  S3Client,
  DeleteObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const env = environment();
const bucketName = env.get(ENV_KEY.AWS_S3_PUBLIC_BUCKET_NAME);

/**
 * 完全にパブリックなバケットからファイルを参照するURLを取得します
 */
const getObjectByPublicBucket = (objectKey: string) => {
  return `https://${bucketName}.s3.${env.get(
    ENV_KEY.AWS_REGION
  )}.amazonaws.com/${objectKey}`;
};

/**
 * バケットからファイルを削除します
 * @description
 *  - パブリック・プライベートのバケットでコードは同じです
 *  - バケットのバージョニングが有効な場合、削除マーカー有無等で少しコード修正が必要です
 */
const deleteObjectByPublicBucket = async (
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
const putObjectByPublicBucket = async (
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
  getObjectByPublicBucket,
  deleteObjectByPublicBucket,
  putObjectByPublicBucket,
};
