/**
 * 検証したいこと
 *  - パブリック・プライベートなバケットにファイルをアップロードする
 *  - lambda、EC2以外の場所でコードを実行する
 */
import { S3_BUCKET_TYPE } from "@/const";
import s3Client from "@/aws_s3/s3";
import { readFileSync } from "fs";
import path from "path";
import { v4 } from "uuid";

async function putObject() {
  const client = s3Client();

  try {
    const file = getUploadFile();
    const objectKey = `upload_test/${v4()}.png`;

    client.connect();
    const putResult = await client.putObject(
      S3_BUCKET_TYPE.PRIVATE,
      objectKey,
      file
    );
    console.log(`アップロード: ${putResult ? "成功" : "失敗"}`);
  } catch (error) {
    console.log(error);
  } finally {
    client.destroy();
  }

  console.log("end.");
}

/**
 * 検証用に/testdata配下のファイルのバッファを作成します
 */
function getUploadFile() {
  const filePath = `${path.resolve(__dirname)}/testdata/a.png`;
  const fileDataByBase64 = readFileSync(filePath, "base64");
  // この検証じゃあんま意味ないけど、APIリクエストでbase64のdata uriを受け取ったと仮定してファイルのバッファ生成
  const fileDataByBuffer = Buffer.from(
    fileDataByBase64.replace(/^data:\w+\/\w+;base64,/, ""),
    "base64"
  );
  return fileDataByBuffer;
}

putObject();
