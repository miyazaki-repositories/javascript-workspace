/**
 * 検証したいこと
 *  - パブリック・プライベートなバケットからファイルを削除する
 *  - lambda、EC2以外の場所でコードを実行する
 */
import s3Client from "@/aws_s3/s3";
import { S3_BUCKET_TYPE } from "@/const";

async function deleteObject() {
  const client = s3Client();

  try {
    client.connect();
    const deleteResult = await client.deleteObject(
      S3_BUCKET_TYPE.PRIVATE,
      "a.txt"
    );
    console.log(`削除: ${deleteResult ? "成功" : "失敗"}`);
  } catch (error) {
    console.log(error);
  } finally {
    client.destroy();
  }

  console.log("end.");
}

deleteObject();
