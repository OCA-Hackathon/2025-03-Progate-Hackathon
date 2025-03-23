import { NextResponse } from "next/server";
import { decrypt } from "@/usecase/crypto/decrypt";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const allCookies = await cookies();
    const accessToken = allCookies.get("accessToken")?.value;

    if (!accessToken) {
      console.warn("No access token found");
      return NextResponse.json({ error: "Unauthorized: No access token found" }, { status: 401 });
    }

    let decryptedAccessToken;
    try {
      decryptedAccessToken = decrypt(accessToken);
    } catch (error) {
      console.error("Token decryption failed:", error);
      return NextResponse.json({ error: "Forbidden: Invalid token" }, { status: 403 });
    }

    return NextResponse.json({ accessToken: decryptedAccessToken });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}