import { NextRequest, NextResponse } from "next/server";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

const client = new SQSClient({
    region: process.env.HACKATHON_AWS_DEFAULT_REGION || "",
    credentials: {
        accessKeyId: process.env.HACKATHON_AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.HACKATHON_AWS_SECRET_ACCESS_KEY || "",
        sessionToken: process.env.HACKATHON_AWS_SESSION_TOKEN || "",
    }
});
const SQS_QUEUE_NAME = process.env.HACKATHON_SQS_QUEUE_URL || "";


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