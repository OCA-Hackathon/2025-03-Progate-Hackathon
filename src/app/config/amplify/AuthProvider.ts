// /app/auth/AuthProvider.tsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";

// ✅ 型定義
interface AuthContextType {
    isSignedIn: boolean;
    loading: boolean;
}

// ✅ コンテキスト作成
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✅ `AuthProvider`（認証状態をグローバルに管理）
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkAuth() {
            try {
                const session = await fetchAuthSession();
                console.log(session);
                setIsSignedIn(!!session.tokens?.accessToken);
            } catch (error) {
                setIsSignedIn(false);
            }
            setLoading(false);
        }
        checkAuth();
    }, []);

    return (
        children
    );
}

