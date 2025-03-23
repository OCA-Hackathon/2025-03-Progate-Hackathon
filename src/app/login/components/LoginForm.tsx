"use client";
import Button from "@/app/components/ui/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAuthSession, signIn, signOut } from "aws-amplify/auth";
import setCookieUseCase from "@/app/usecase/cookie/cookie";

export default function LoginForm() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

const handleLogin = async () => {
    try {
      await signOut();
      const { nextStep } = await signIn({ username, password });
      console.log("Next step:", nextStep);

      if (nextStep.signInStep === "DONE") {

        // const user = await getCurrentUser();
        const session = await fetchAuthSession({ forceRefresh: true });

        // console.log("User:", user);
        // console.log("Session:", session);
        const accessToken = session.tokens?.accessToken?.toString();
        // console.log("idToken:", idToken);
        // console.log("accessToken:", accessToken);
        if (accessToken) {
          // await fetch("/api/auth/post", {
          //   method: "POST",
          //   headers: { "Content-Type": "application/json" },
          //   // body: JSON.stringify({ name: "accessToken", token: accessToken, maxAge: 24 * 60 * 60 }),
          //   body: JSON.stringify({ accessToken }),
          // });
          await setCookieUseCase({ name: "accessToken", token: accessToken, maxAge: 60 * 60 });
        } else {
          console.log("Tokens are undefined");
        }
        router.push("/home");
      } else {
        setMessage(`Additional step required: ${nextStep.signInStep}`);
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setMessage("Invalid username or password");
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1C1C1C] text-white">
      <div className="w-full max-w-md p-8 rounded-xl bg-[#252525] shadow-2xl border border-[#333333]">
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">LOGIN</h1>

        {message && (
          <div className="py-2 px-4 text-red-500 text-center">
            {message}
          </div>
        )}
        <div className="space-y-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-3 bg-[#1C1C1C] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            </div>
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 bg-[#1C1C1C] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            </div>
          </div>

          <Button onClick={handleLogin}>LOGIN</Button>

          <div className="flex items-center justify-between mt-4 text-sm">
            <div className="flex items-center">
              <input id="remember-me" type="checkbox" className="h-4 w-4 accent-purple-500 rounded" />
              <label htmlFor="remember-me" className="ml-2 text-gray-400">Remember me</label>
            </div>
            <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors duration-300">Forgot password?</a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#333333] text-center text-gray-400 text-sm">
          Don&apos;t have an account? <a href="/register" className="text-purple-400 hover:text-purple-300 transition-colors duration-300">Register</a>
        </div>
      </div>
    </div>
  );
}

