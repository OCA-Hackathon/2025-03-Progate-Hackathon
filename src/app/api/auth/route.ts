import { NextRequest, NextResponse } from "next/server";
import { encrypt } from "@/app/usecase/crypto/encrypt";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const accessToken = body.accessToken;
        const encryptedToken = encrypt(accessToken);
        console.log("Access Token:", accessToken);
        console.log('----------')
        console.log("Encrypted Token:", encryptedToken);
        const response = NextResponse.json({ success: true });

        response.cookies.set("accessToken", encryptedToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "strict",
            maxAge: 24 * 60 * 60,
        });
        return response;
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
