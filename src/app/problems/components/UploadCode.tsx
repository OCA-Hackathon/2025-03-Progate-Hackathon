import AWS from 'aws-sdk';

interface UploadCodeProps {
    userId: string;
    problemId: string;
    code: string;
    language: string;
}

export default async function UploadCode({ userId, problemId, code, language }: UploadCodeProps) {
    const bucket = process.env.BUCKET_NAME || '';
    const region = process.env.REGION || '';
    const accessKey = process.env.ACCESS_KEY || '';
    const secretAccessKey = process.env.SECRET_ACCESS_KEY || '';

    AWS.config.update({
        region: region,
        credentials: new AWS.Credentials({
            accessKeyId: accessKey,
            secretAccessKey: secretAccessKey
        })
    });

    const s3 = new AWS.S3();
    const timestamp = new Date().getTime();
    const fileExt = {'go':'go','python':'py','rust':'rs','cpp':'cpp'}[language] || 'txt';
    const newSubmissionKey = `submissions/${userId}/${problemId}/${timestamp}.${fileExt}`;


    return await s3.putObject({
        Bucket: bucket,
        Key: newSubmissionKey,
        Body: code,
        ContentType: 'text/plain'
      }).promise();
}