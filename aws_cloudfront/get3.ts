/**
 * 検証したいこと
 *  - cloudfrontを使用した署名付きURLでファイルを参照する
 *  - lambda、EC2以外の場所でコードを実行する
 */
import { createSignedUrl2 } from "@/aws_cloudfront/cloudfront";

 function get() {
  const objectKey = "a.txt";

  try {
    const objectUrl = createSignedUrl2(objectKey);

    console.log(objectUrl);
  } catch (error) {
    console.log(error);

    console.log("end.");
  }
}

get();
