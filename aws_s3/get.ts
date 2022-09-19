import s3Client from "@/aws_s3/s3";

async function get() {
  const client = s3Client();

  try {
    client.connect();
    const objectUrl = await client.getObjectByPrivateBucket("a.txt");
    console.log(objectUrl);
  } catch (error) {
    console.log(error);
  } finally {
    client.destroy();
  }

  console.log("end.");
}

get();
