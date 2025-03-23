import { Amplify } from "aws-amplify";import { AuthConfig } from "@/app/types/amplify/types";

export function configureAmplify(authConfig: AuthConfig) {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: authConfig.userPoolId,
        userPoolClientId: authConfig.userPoolClientId,
      }
    },
  });
}
