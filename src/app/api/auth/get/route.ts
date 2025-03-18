import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/app/usecase/crypto/decrypt";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
    // const allCookies = await cookies();
    // const accessToken = allCookies.get("accessToken")?.value;
    // if (!accessToken) {
    //     return NextResponse.json({ error: "No accessToken found" }, { status: 404 });
    // }
    // console.log('accessTokenCookie:', accessToken);
    // const decryptedAccessToken = decrypt(accessToken);

    // return NextResponse.json({ accessToken: decryptedAccessToken });

    try {
        const allCookies = await cookies();
        const accessToken = allCookies.get("accessToken")?.value;

        if (!accessToken) {
            console.warn("No access token found");
            return NextResponse.json({ error: "Unauthorized: No access token found" }, { status: 401 });
        }

        // console.log("Encrypted AccessToken from Cookie:", accessToken);

        // ✅ トークンを復号化
        let decryptedAccessToken;
        try {
            decryptedAccessToken = decrypt(accessToken);
        } catch (error) {
            console.error("Token decryption failed:", error);
            return NextResponse.json({ error: "Forbidden: Invalid token" }, { status: 403 });
        }
        return NextResponse.json({ accessToken: decryptedAccessToken});
    } catch (error) {
        console.error("Internal Server Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}




// export async function GET(req: NextRequest) {
//     try {
//         const allCookies = await cookies();
//         const accessToken = allCookies.get("accessToken")?.value;

//         if (!accessToken) {
//             return NextResponse.json({ error: "No accessToken found" }, { status: 404 });
//         }

//         console.log("Encrypted accessToken:", accessToken);
//         const decryptedAccessToken = decrypt(accessToken);
//         console.log("Decrypted accessToken:", decryptedAccessToken);

//         // ✅ JWT をデコードして `kid` を取得
//         const decodedToken: jwt.Jwt | null = jwt.decode(decryptedAccessToken, { complete: true });
//         if (!decodedToken || !decodedToken.header || !decodedToken.header.kid) {
//             return NextResponse.json({ error: "Invalid token" }, { status: 401 });
//         }

//         const kid = decodedToken.header.kid;
//         console.log("Token KID:", kid);

//         // ✅ Cognito の公開鍵を取得
//         const publicKey = await getCognitoPublicKey(kid);
//         if (!publicKey) {
//             return NextResponse.json({ error: "Failed to retrieve public key" }, { status: 401 });
//         }

//         // ✅ 署名を検証
//         try {
//             const verifiedToken = jwt.verify(decryptedAccessToken, publicKey, { algorithms: ["RS256"] });
//             console.log("Verified JWT:", verifiedToken);
//             return NextResponse.json({ accessToken: decryptedAccessToken, user: verifiedToken });
//         } catch (err) {
//             console.error("JWT verification failed:", err);
//             return NextResponse.json({ error: "Invalid token signature" }, { status: 401 });
//         }
//     } catch (error) {
//         console.error("Token validation failed:", error);
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }