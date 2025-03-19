import CodeApp from "@/app/test/components/test";

export default function Test() {
    const bucket = process.env.S3_BUCKET_NAME || '';
    const region = process.env.REGION || '';
    const accessKey = process.env.ACCESS_KEY || '';
    const secretAccessKey = process.env.SECRET_ACCESS_KEY || '';
    return (
        <CodeApp {...{ bucket, region, accessKey, secretAccessKey }}/>
    );
}