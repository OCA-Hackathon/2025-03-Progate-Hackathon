import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({ message: "Logged out successfully" });
    response.headers.set("Set-Cookie", "accessToken=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0;");

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}