import AWS from 'aws-sdk';

interface UploadCodeProps {
    userId: string;
    problemId: string;
    code: string;
    language: string;
}

export default async function UploadCode({ userId, problemId, code, language }: UploadCodeProps) {
    const bucket = process.env.HACKATHON_S3_BUCKET_NAME || '';
    const region = process.env.HACKATHON_AWS_DEFAULT_REGION || '';
    const accessKey = process.env.HACKATHON_AWS_ACCESS_KEY_ID || '';
    const secretAccessKey = process.env.HACKATHON_AWS_SECRET_ACCESS_KEY || '';

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