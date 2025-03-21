import { NextRequest, NextResponse } from "next/server";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

const client = new SQSClient({
    region: process.env.REGION || "",
    credentials: {
        accessKeyId: process.env.ACCESS_KEY || "",
        secretAccessKey: process.env.SECRET_ACCESS_KEY || "",
    }
});
const SQS_QUEUE_NAME = process.env.SQS_QUEUE_URL || "";

export async function POST(req: NextRequest) {
  try {
    const { username, problemId, code, language } = await req.json();

    const command = new SendMessageCommand({
      QueueUrl: SQS_QUEUE_NAME,
      MessageBody: JSON.stringify({ username, problemId, code, language }),
    });

    const response = await client.send(command);
    console.log("Response:", response);

    return NextResponse.json({ success: true, message: "Sent to SQS" });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}