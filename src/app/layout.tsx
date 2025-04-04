import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/feature/header/components/Header";
import Footer from "@/feature/footer/Footer";
import "./globals.css";
import ClientProvider from "@/config/amplify/ClientProvider";
import { configureAmplify } from "@/config/amplify/AmplifyConf";
import { AuthConfig } from "@/types/amplify/types";
import { AuthProvider } from "@/contexts/auth/useAuth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | RaidersALG',
    default: 'RaidersALG',
  },
  description: 'RaidersALG is a platform for competitive programming enthusiasts to practice and compete in contests.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authConfig: AuthConfig = {
    userPoolId: process.env.HACKATHON_COGNITO_USER_POOL_ID || "",
    userPoolClientId: process.env.HACKATHON_COGNITO_USER_POOL_CLIENT_ID || "",
  };

  configureAmplify(authConfig);

  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientProvider authConfig={authConfig}>
          <AuthProvider>
            <Header />
            {children}
          </AuthProvider>
          <Footer />
        </ClientProvider>
      </body>
    </html>
  );
}