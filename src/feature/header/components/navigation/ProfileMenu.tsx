"use client";
import { useState, useRef, useEffect } from "react";
import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { Bell, User } from "lucide-react";
import { useAuth } from "@/contexts/auth/useAuth";

export default function ProfileMenu() {
  const router = useRouter();
  const { isLogin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ログアウト処理
  const handleLogout = async () => {
    try {
      await signOut();
      await fetch("/api/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {isLogin ? (
        <>
          <div className="flex items-center space-x-6">
            <button className="items-center space-x-2">
              <Bell size={24} className="cursor-pointer" />
            </button>

            <button onClick={() => setIsOpen(!isOpen)} className="items-center space-x-2">
              <User size={24} className="cursor-pointer" />
            </button>
          </div>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-primary text-white rounded-lg shadow-lg">
              <button className="block w-full text-left px-4 py-2 hover:bg-[#252525]">
                Upgrade Plan
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-[#252525] rounded-bl-lg rounded-br-lg"
              >
                Logout
              </button>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}