/**
 * 検証したいこと
 *  - cloudfrontを使用した署名付きURLでファイルを参照する
 *  - lambda、EC2以外の場所でコードを実行する
 */
import { getSignedUrlAsync } from "@/aws_cloudfront/cloudfront";

async function get() {
  const objectKey = "a.txt";

  try {
    const objectUrl = await getSignedUrlAsync(objectKey);

    console.log(objectUrl);
  } catch (error) {
    console.log(error);

    console.log("end.");
  }
}

get();
