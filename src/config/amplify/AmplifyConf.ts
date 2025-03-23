import { Amplify } from "aws-amplify";import { AuthConfig } from "@/types/amplify/types";

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
