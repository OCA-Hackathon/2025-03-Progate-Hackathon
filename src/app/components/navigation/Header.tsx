"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "aws-amplify/auth";
import { User } from "lucide-react";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement | null>(null);

    const handleLogout = async () => {
        try {
            await signOut();
            await fetch("/api/logout", { method: "POST" });
            router.push("/login");
        } catch (error) {
            console.error("Sign out error:", error);
        }
    };

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

    return (
        <header className="w-full h-16 bg-primary text-white flex items-center justify-between px-6 shadow-md relative">
            <h1 className="text-lg font-bold">Code Arena</h1>
              <div className="relative" ref={menuRef}>
                  <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2">
                      <User size={24} className="cursor-pointer" />
                  </button>

                  {isOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-primary text-white rounded-lg shadow-lg">
                          <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-200">
                              Upgrade Plan
                          </button>
                          <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-200">
                              Logout
                          </button>
                      </div>
                  )}
              </div>
        </header>
    );
}
