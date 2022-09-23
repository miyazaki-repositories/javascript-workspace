import environment, { ENV_KEY } from "@/env";
import { S3_BUCKET_TYPE } from "@/const";
import { S3Client } from "@aws-sdk/client-s3";
import {
  deleteObjectByPrivateBucket,
  getObjectByPrivateBucket,
  putObjectByPrivateBucket,
} from "./privateBucket";
import {
  getObjectByPublicBucket,
  deleteObjectByPublicBucket,
  putObjectByPublicBucket,
} from "./publicBucket";

const s3Client = () => {
  const env = environment();
  let client: S3Client;

  /**
   * S3Clientのインスタンス生成を行います
   */
  const connect = (): void => {
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

  /**
   * S3Clientの接続？インスタンス？を破棄します
   * @description
   *  - node.jsなので、一応明示的に呼ぶようにします
   */
  const destroy = (): void => {
    client.destroy();
  };

  /**
   * s3オブジェクトを参照するURLを取得します
   */
  const getObjectUrl = async (
    bucketType: typeof S3_BUCKET_TYPE[keyof typeof S3_BUCKET_TYPE],
    objectKey: string
  ): Promise<string> => {
    const objectUrl: string =
      bucketType === S3_BUCKET_TYPE.PUBLIC
        ? getObjectByPublicBucket(objectKey)
        : await getObjectByPrivateBucket(client, objectKey);

    return objectUrl;
  };

  /**
   * s3オブジェクトを削除します
   */
  const deleteObject = async (
    bucketType: typeof S3_BUCKET_TYPE[keyof typeof S3_BUCKET_TYPE],
    objectKey: string
  ): Promise<boolean> => {
    return bucketType === S3_BUCKET_TYPE.PUBLIC
      ? await deleteObjectByPublicBucket(client, objectKey)
      : await deleteObjectByPrivateBucket(client, objectKey);
  };

  /**
   * s3にファイルをアップロードします
   */
  const putObject = async (
    bucketType: typeof S3_BUCKET_TYPE[keyof typeof S3_BUCKET_TYPE],
    objectKey: string,
    file: Buffer
  ): Promise<boolean> => {
    return bucketType === S3_BUCKET_TYPE.PUBLIC
      ? await putObjectByPublicBucket(client, objectKey, file)
      : await putObjectByPrivateBucket(client, objectKey, file);
  };

  return {
    connect,
    destroy,
    getObjectUrl,
    deleteObject,
    putObject,
  };
};

export default s3Client;
