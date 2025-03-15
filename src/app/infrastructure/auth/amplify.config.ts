import { Amplify, ResourcesConfig } from "aws-amplify";

const awsConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      // userPoolId: process.env.COGNITO_USER_POOL_ID || '',
      // userPoolClientId: process.env.COGNITO_USER_POOL_CLIENT_ID || '',
      userPoolId: 'ap-northeast-1_aSMNwt889',
      userPoolClientId: '2lva1hme2uneprghdjpq3ev8rs',
    },
  },
};

Amplify.configure(awsConfig);
