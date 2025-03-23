"use client";
import { usePathname } from "next/navigation";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import jwt from "jsonwebtoken";
import GetCookieUseCase from "@/app/usecase/cookie/GetCookie";

interface AuthContextType {
  isLogin: boolean | null;
  username: string | null
  setIsLogin: (value: boolean) => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLogin, setIsLogin] = useState<boolean | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const pathname = usePathname();

  const checkAuth = async () => {
    try {
      // const response = await fetch("/api/auth/get", {
      //   method: "GET",
      //   credentials: "include",
      // });
      // const data = await response.json();
      const accessToken = await GetCookieUseCase({ name: "accessToken" });
      setIsLogin(true);
      const decodedToken = jwt.decode(accessToken);
      // console.log("Decoded token:", decodedToken);
      if (typeof decodedToken !== "string" && decodedToken?.username) {
        setUsername(decodedToken.username);
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      setIsLogin(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  return (
    <AuthContext.Provider value={{ isLogin, setIsLogin, username, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}