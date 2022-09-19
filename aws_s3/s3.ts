import environment, { ENV_KEY } from "@/env";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = () => {
  const env = environment()
  let client: S3Client;

  const connect = () => {
    const region = env.get(ENV_KEY.AWS_REGION)
    const credentials = {
      accessKeyId :env.get(ENV_KEY.AWS_ACCESS_KEY_ID),
      secretAccessKey : env.get(ENV_KEY.AWS_SECRET_ACCESS_KEY)
    }

    if(!region || !credentials.accessKeyId || !credentials.secretAccessKey) {
      throw new Error("認証情報が設定されていません");
    }

    client = new S3Client({
      region,
      credentials,
    });
  };

  const destroy = () => {
    client.destroy();
  };

  // 完全にパブリックなバケットからファイルを参照するURLを取得します。
  const getObjectByPublicBucket = (objectKey: string) => {
    const bucketName = env.get(ENV_KEY.AWS_S3_PUBLIC_BUCKET_NAME);
    if (!bucketName) {
      throw new Error("バケット名が設定されていません");
    }

    return `https://${bucketName}.s3.${env.get(ENV_KEY.AWS_REGION)}.amazonaws.com/${objectKey}`;
  };

  // プライベートなバケットのファイルを参照する署名付きURLを取得します。
  const getObjectByPrivateBucket = async (objectKey: string) => {
    const bucketName = env.get(ENV_KEY.AWS_S3_PRIVATE_BUCKET_NAME);
    if (!bucketName) {
      throw new Error("バケット名が設定されていません");
    }
    const expiresIn = Number(env.get(ENV_KEY.AWS_SIGNED_URL_EXPIRE_SECOND))
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

  return {
    connect,
    destroy,
    getObjectByPublicBucket,
    getObjectByPrivateBucket,
  };
};

export default s3Client;
