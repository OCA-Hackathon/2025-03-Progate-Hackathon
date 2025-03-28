"use client";
import { useEffect, ReactNode } from "react";
import { configureAmplify } from "@/config/amplify/AmplifyConf";
import { AuthConfig } from "@/types/amplify/types";

interface ClientProviderProps {
  authConfig: AuthConfig;
  children: ReactNode;
}

export default function ClientProvider({ authConfig, children }: ClientProviderProps) {
  useEffect(() => {
    if (authConfig.userPoolId && authConfig.userPoolClientId) {
      configureAmplify(authConfig);
    }
  }, [authConfig.userPoolId, authConfig.userPoolClientId]);

  return children;
}