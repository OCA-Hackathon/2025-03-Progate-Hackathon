import { Amplify, ResourcesConfig } from "aws-amplify";

const awsConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      // userPoolId: process.env.COGNITO_USER_POOL_ID || '',
      // userPoolClientId: process.env.COGNITO_USER_POOL_CLIENT_ID || '',
      userPoolId: 'xxxxx',
      userPoolClientId: 'xxxxx',
    },
  },
};

Amplify.configure(awsConfig);
