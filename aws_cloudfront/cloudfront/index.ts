import environment, { ENV_KEY } from "@/env";
import { getSignedUrl as getSignedUrl2 } from "@aws-sdk/cloudfront-signer";
// @ts-ignore
import { getSignedUrl } from "aws-cloudfront-sign";
import AWS from "aws-sdk";

const env = environment();

function getSignedUrlAsync(objectKey: string): Promise<string> {
  const keypairId = env.get(ENV_KEY.AWS_CLOUD_FRONT_KEY_PAIR_ID);
  const privateKey = env.get(ENV_KEY.AWS_CLOUD_FRONT_PRIVATE_KEY);

  return new Promise((resolve, reject) => {
    // Signerインスタンスを生成
    const signer = new AWS.CloudFront.Signer(keypairId, privateKey);
    // URL生成
    signer.getSignedUrl(
      {
        url: `${env.get(ENV_KEY.AWS_CLOUD_FRONT_BASE_URL)}${objectKey}`,
        expires: Number(env.get(ENV_KEY.AWS_SIGNED_URL_EXPIRE_SECOND)),
      },
      (err, url) => {
        if (err) {
          reject(err);
        }
        resolve(url);
      }
    );
  });
}

function createSignedUrl(objectKey: string): string {
  const keypairId = env.get(ENV_KEY.AWS_CLOUD_FRONT_KEY_PAIR_ID);
  const privateKey = env.get(ENV_KEY.AWS_CLOUD_FRONT_PRIVATE_KEY);
  // ちなこのライブラリ非推奨ってstackoverflowで外人が言ってた
  const signedUrl = getSignedUrl(
    `${env.get(ENV_KEY.AWS_CLOUD_FRONT_BASE_URL)}${objectKey}`,
    {
      keypairId: keypairId,
      privateKeyString: privateKey,
    }
  ) as string;

  return signedUrl;
}

// これが一番今時でスマートな気がする
function createSignedUrl2(objectKey: string): string {
  const keypairId = env.get(ENV_KEY.AWS_CLOUD_FRONT_KEY_PAIR_ID);
  const privateKey = env.get(ENV_KEY.AWS_CLOUD_FRONT_PRIVATE_KEY);
  const dateLessThan = "2022-10-12 02:30:00";

  const signedUrl = getSignedUrl2({
    url: `${env.get(ENV_KEY.AWS_CLOUD_FRONT_BASE_URL)}${objectKey}`,
    keyPairId: keypairId,
    dateLessThan: dateLessThan,
    privateKey: privateKey,
  });

  return signedUrl;
}

export { getSignedUrlAsync, createSignedUrl, createSignedUrl2 };
