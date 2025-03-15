import type { AppProps } from "next/app";
import "../amplify-config"; // ✅ 必ず読み込む

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
