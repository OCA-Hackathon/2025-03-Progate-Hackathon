"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { verifyToken } from "@/app/usecase/auth/useAuth";
import jwt from "jsonwebtoken";

export default function Home() {
    const [username, setUsername] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const accessToken = await verifyToken();

                if (!accessToken) {
                    console.warn("No access token found. Redirecting to /forbidden");
                    router.push("/home");
                    return;
                }

                const decodedToken = jwt.decode(accessToken);
                const user = (decodedToken as jwt.JwtPayload)?.username || null;

                if (!user) {
                    console.warn("No username found in token. Redirecting to /forbidden");
                    router.push("/forbidden");
                    return;
                }

                setUsername(user);
            } catch (error) {
                console.error("Token verification failed:", error);
                router.push("/forbidden");
            }
        };

        fetchUsername();
    }, [router]);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Welcome, {username}!</h1>
        </div>
    );
}
