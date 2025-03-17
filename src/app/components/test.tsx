'use client';

import { Amplify } from 'aws-amplify';
import { awsConfig } from '@/app/config/AmplifyConf';

Amplify.configure(awsConfig, { ssr: true });

export default function ConfigureAmplifyClientSide() {
  return null;
}