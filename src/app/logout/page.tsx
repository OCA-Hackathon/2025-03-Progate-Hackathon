"use client";
import { signOut } from "aws-amplify/auth";

export default function LogoutPage() {
  const handleLogout = async () => {
    try {
      await signOut();
      await fetch("/api/logout", { method: "POST" });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <div>
      <p>Logout Page</p>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleLogout}
      >
        LOGOUT
      </button>
    </div>
  );
}