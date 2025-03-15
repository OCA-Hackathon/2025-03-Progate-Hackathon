"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, fetchAuthSession, signIn } from "aws-amplify/auth";
import "@/app/infrastructure/auth/amplify.config";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      const { nextStep } = await signIn({ username, password });

      if (nextStep.signInStep === "DONE") {
        setMessage("Login successful!");

        // ✅ ユーザー情報とセッションを取得
        const user = await getCurrentUser();
        const session = await fetchAuthSession({ forceRefresh: true });

        console.log("User:", user);
        console.log("Session:", session);
        const accessToken = session.tokens?.accessToken?.toString();
        if (accessToken) {
          console.log("Access Token:", accessToken);

          console.log("Sending Access Token to the server...");
          // ✅ API `/api/auth` に `accessToken` を送信 (サーバーに Cookie 設定を依頼)
          await fetch("/api/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ accessToken }),
          });
          console.log("Access Token sent to the server.");
        } else {
          console.log("Tokens are undefined");
        }

        // ✅ `/home` にリダイレクト
        router.push("/home");
      } else {
        setMessage(`Additional step required: ${nextStep.signInStep}`);
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setMessage("Login failed.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-4">Custom Login</h1>

      <input
        type="text"
        placeholder="Username"
        className="border px-4 py-2 mb-2 text-black"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border px-4 py-2 mb-2 text-black"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignIn} className="bg-blue-600 px-4 py-2 rounded">
        Sign In
      </button>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
