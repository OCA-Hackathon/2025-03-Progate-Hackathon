"use client";
import Button from "@/app/components/ui/Button";
import { useState } from "react";
import { signUp } from "aws-amplify/auth";

export default function RegisterForm() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const handleRegister = async () => {
    console.log("Registering...");
    console.log("Username:", username);
    console.log("Password:", password);

    try {
      const { isSignUpComplete } = await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email: ""
          },
        },
      });

      console.log("isSignUpComplete:", isSignUpComplete);
      if (isSignUpComplete) {
        setMessage("Registration successful. Please login.");
        setMessageType("success");
      }
    } catch (error) {
      console.error("Register error:", error);
      setMessage("Registration failed.");
      setMessageType("error");
    }
  }


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1C1C1C] text-white">
      <div className="w-full max-w-md p-8 rounded-xl bg-[#252525] shadow-2xl border border-[#333333]">
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">REGISTER</h1>

        {message && (
          <div className={`text-center mb-4 ${
            messageType === "success"
              ? "text-green-600"
              : messageType === "error"
              ? "text-red-600"
              : ""
          }`}>
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

          <Button onClick={handleRegister}>REGISTER</Button>
        </div>

        <div className="mt-8 pt-6 border-t border-[#333333] text-center text-gray-400 text-sm">
          Already have an account? <a href="/login" className="text-purple-400 hover:text-purple-300 transition-colors duration-300">Login</a>
        </div>
      </div>
    </div>
  );
}

