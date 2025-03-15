import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/app/usecase/crypto/decrypt";
import jwt from "jsonwebtoken"; // JWT の署名検証

export function middleware(req: NextRequest) {
    try {
        // ✅ Cookie から `idToken` を取得
        const encryptedToken = req.cookies.get("idToken")?.value;

        if (!encryptedToken) {
            console.log("No token found. Redirecting to /login");
            return NextResponse.redirect(new URL("/login", req.url));
        }

        console.log("Encrypted Token:", encryptedToken);

        // ✅ `idToken` を復号化
        const decryptedToken = decryptJWT(encryptedToken);
        console.log("Decrypted Token:", decryptedToken);

        // ✅ JWT の署名を検証 (Cognito の公開鍵を使う)
        const decoded = jwt.verify(decryptedToken, process.env.COGNITO_PUBLIC_KEY!);
        console.log("Decoded JWT:", decoded);

        // ✅ トークンの有効期限を確認
        if (decoded.exp * 1000 < Date.now()) {
            console.log("Token expired. Redirecting to /login");
            return NextResponse.redirect(new URL("/login", req.url));
        }

        console.log("Token is valid. Access granted.");
        return NextResponse.next();
    } catch (error) {
        console.error("Token validation failed:", error);
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

// ✅ `/home` へのアクセス時にミドルウェアを適用
export const config = {
    matcher: ["/home"],
};
