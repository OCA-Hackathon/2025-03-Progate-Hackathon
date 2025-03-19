"use client";
import { useState, useRef, useEffect } from "react";
import { signOut } from "aws-amplify/auth";
import { useRouter, usePathname } from "next/navigation";
import { Bell, User } from "lucide-react";
import { useAuth } from "@/app/config/amplify/AuthProvider";


export default function Profile() {
    const router = useRouter();
    const pathname = usePathname();
    const { isLogin } = useAuth();
    // const [isLogin, setIsLogin] = useState<boolean | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    // console.log("isLogin:", isLogin);

    // useEffect(() => {
    //     const checkAuth = async () => {
    //         try {
    //           const response = await fetch("/api/auth/get", {
    //               method: "GET",
    //               credentials: "include",
    //           });
    //           if (response.ok) {
    //               setIsLogin(true);
    //           }else{
    //               setIsLogin(false);
    //           }
    //         } catch (error) {
    //             console.error("Error fetching auth session:", error);
    //             setIsLogin(false);
    //         }
    //     };

    //     checkAuth();
    // }, [pathname]);

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
            // setIsLogin(false);
            router.push("/login");
        } catch (error) {
            console.error("Sign out error:", error);
        }
    };

    return (
        <div className="relative" ref={menuRef}>
            {isLogin ? (
                <>  <div className="flex items-center space-x-6">
                        <button className="items-center space-x-2">
                            <Bell size={24} className="cursor-pointer" />
                        </button>

                        <button onClick={() => setIsOpen(!isOpen)} className="items-center space-x-2">
                            <User size={24} className="cursor-pointer" />
                        </button>

                        {/* <button className="items-center space-x-2">
                            <Settings size={24} className="cursor-pointer" />
                        </button> */}
                    </div>

                    {isOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-primary text-white rounded-lg shadow-lg">
                            <button className="block w-full text-left px-4 py-2 hover:bg-gray-700">
                                Upgrade Plan
                            </button>
                            <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded-bl-lg rounded-br-lg">
                                Logout
                            </button>
                        </div>
                    )}
                </>
            ) : (
                null
            )}
        </div>
    );
}
