import environment, { ENV_KEY } from "@/env";
import { S3_BUCKET_TYPE } from "@/const";
import { S3Client } from "@aws-sdk/client-s3";
import {
  deleteObjectByPrivateBucket,
  getObjectByPrivateBucket,
} from "./privateBucket";
import {
  getObjectByPublicBucket,
  deleteObjectByPublicBucket,
} from "./publicBucket";

const s3Client = () => {
  const env = environment();
  let client: S3Client;

  const connect: () => void = () => {
    const region = env.get(ENV_KEY.AWS_REGION);
    const credentials = {
      accessKeyId: env.get(ENV_KEY.AWS_ACCESS_KEY_ID),
      secretAccessKey: env.get(ENV_KEY.AWS_SECRET_ACCESS_KEY),
    };

    if (!region || !credentials.accessKeyId || !credentials.secretAccessKey) {
      throw new Error("認証情報が設定されていません");
    }

    client = new S3Client({
      region,
      credentials,
    });
  };

  const destroy: () => void = () => {
    client.destroy();
  };

  const getObjectUrl: (
    bucketType: typeof S3_BUCKET_TYPE[keyof typeof S3_BUCKET_TYPE],
    objectKey: string
  ) => Promise<string> = async (bucketType, objectKey) => {
    const objectUrl: string =
      bucketType === S3_BUCKET_TYPE.PUBLIC
        ? getObjectByPublicBucket(objectKey)
        : await getObjectByPrivateBucket(client, objectKey);

    return objectUrl;
  };

  const deleteObject: (
    bucketType: typeof S3_BUCKET_TYPE[keyof typeof S3_BUCKET_TYPE],
    objectKey: string
  ) => Promise<boolean> = async (bucketType, objectKey) => {
    return bucketType === S3_BUCKET_TYPE.PUBLIC
      ? await deleteObjectByPublicBucket(client, objectKey)
      : await deleteObjectByPrivateBucket(client, objectKey);
  };

  return {
    connect,
    destroy,
    getObjectUrl,
    deleteObject,
  };
};

export default s3Client;
