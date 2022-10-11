import "dotenv/config";

const ENV_VALUE = {
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_REGION: process.env.AWS_REGION,
  AWS_S3_PUBLIC_BUCKET_NAME: process.env.AWS_S3_PUBLIC_BUCKET_NAME,
  AWS_S3_PRIVATE_BUCKET_NAME: process.env.AWS_S3_PRIVATE_BUCKET_NAME,
  AWS_SIGNED_URL_EXPIRE_SECOND: process.env.AWS_SIGNED_URL_EXPIRE_SECOND,
  AWS_CLOUD_FRONT_BASE_URL: process.env.AWS_CLOUD_FRONT_BASE_URL,
  AWS_CLOUD_FRONT_KEY_PAIR_ID: process.env.AWS_CLOUD_FRONT_KEY_PAIR_ID,
  // 改行消して環境変数に設定した秘密鍵の改行を復元して取得
  AWS_CLOUD_FRONT_PRIVATE_KEY: process.env.AWS_CLOUD_FRONT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
} as const;

export type ENV_KEY_TYPE = keyof typeof ENV_VALUE;
export type ENV_VALUE_TYPE = typeof ENV_VALUE[ENV_KEY_TYPE];
type KEYS = { [key in ENV_KEY_TYPE]: ENV_KEY_TYPE };

// 外部から扱いやすいようENV_VALUEのキーの一覧を抽出します。
const ENV_KEY = Object.keys(ENV_VALUE).reduce<KEYS>((object, key) => {
  object[key as ENV_KEY_TYPE] = key as ENV_KEY_TYPE;
  return object;
}, {} as KEYS);

// 関数で返す意味は通常ありませんが、jestを使用した場合にprocess.envを置換するよりモッキングが楽になります。
const environment = () => {
  const get: (key: ENV_KEY_TYPE) => string = (key: ENV_KEY_TYPE) =>
    ENV_VALUE[key] || "";

  return {
    get,
  };
};

export default environment;
export { ENV_KEY };
