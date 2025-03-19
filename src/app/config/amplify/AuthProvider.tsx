"use client";
import { usePathname } from "next/navigation";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isLogin: boolean | null;
  setIsLogin: (value: boolean) => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLogin, setIsLogin] = useState<boolean | null>(null);
  const pathname = usePathname();

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/get", {
        method: "GET",
        credentials: "include",
      });
      setIsLogin(response.ok);
    } catch (error) {
      console.error("Error checking auth:", error);
      setIsLogin(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  return (
    <AuthContext.Provider value={{ isLogin, setIsLogin, checkAuth }}>
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