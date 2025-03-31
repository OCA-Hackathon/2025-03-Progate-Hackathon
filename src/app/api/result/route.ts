import { NextRequest, NextResponse } from "next/server";
import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";

const client = new S3Client({
    region: process.env.HACKATHON_AWS_DEFAULT_REGION || "",
    credentials: {
        accessKeyId: process.env.HACKATHON_AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.HACKATHON_AWS_SECRET_ACCESS_KEY || "",
        sessionToken: process.env.HACKATHON_AWS_SESSION_TOKEN || "",
    }
});
const S3_BUCKET_NAME = process.env.HACKATHON_S3_BUCKET_NAME || "";

// S3 のレスポンス Body → string に変換
async function streamToString(stream: Readable): Promise<string> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf-8");
}

export async function POST(req: NextRequest) {
  try {
    const { username, problemId } = await req.json();
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
    // await delay(60000);

    let attempts = 0;
    const maxAttempts = 5;
    // console.log("Request:", { username, problemId });

    const input = {
      Bucket: S3_BUCKET_NAME,
      Prefix: `results/${username}/${problemId}/`,
      MaxKeys: 50,
    };

    while (attempts < maxAttempts) {
      attempts++;
      console.log(`Polling attempt ${attempts}/${maxAttempts}`);
      const command = new ListObjectsV2Command(input);
      const response = await client.send(command);

      if (response.Contents && response.Contents.length > 0) {
        const resultFiles = response.Contents
          .filter((item) => item.Key && !item.Key.endsWith('/latest.json'))
          .sort(
            (a, b) =>
              new Date(b.LastModified || 0).getTime() -
              new Date(a.LastModified || 0).getTime()
          );

        if (resultFiles.length > 0) {
          const latestFile = resultFiles[0];
          console.log(`Found file: ${latestFile.Key}`);

          const getCommand = new GetObjectCommand({
            Bucket: S3_BUCKET_NAME,
            Key: latestFile.Key!,
          });
          const getResponse = await client.send(getCommand);
          if (!getResponse.Body) {
            throw new Error("Response body is undefined");
          }
          const bodyString = await streamToString(getResponse.Body as Readable);

          const result = JSON.parse(bodyString || "{}");
          console.log("Parsed result:", result);

          return NextResponse.json({ success: true, result });
        }
      }

      await delay(2000);
    }

    return NextResponse.json(
      { success: false, message: "Timed out waiting for result." },
      { status: 202 }
    );
  } catch (error) {
    console.error("Error retrieving result:", error);
    return NextResponse.json(
      { error: "Failed to retrieve results" },
      { status: 500 }
    );
  }
}