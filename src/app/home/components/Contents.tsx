"use client";
import { useEffect, useState } from "react";
import "@/app/infrastructure/auth/amplify.config";
import { getCurrentUser } from "aws-amplify/auth";

export default function Contents() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsername = async () => {
      const user = await getCurrentUser();
      setUsername(user?.username || "Guest");
    };

    fetchUsername();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome, {username}!</h1>
      <p>Welcome to the home page.</p>
    </div>
  );
}
