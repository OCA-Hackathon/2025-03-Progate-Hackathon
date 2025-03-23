import { NextRequest, NextResponse } from "next/server";
import { encrypt } from "@/usecase/crypto/encrypt";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const accessToken = body.accessToken;
    const encryptedToken = encrypt(accessToken);
    const response = NextResponse.json({ success: true });

    const cookieStore = await cookies();
    cookieStore.set({
      name: "accessToken",
      value: encryptedToken,
      httpOnly: true,
      path: "/",
      secure: true,
      maxAge: 60 * 60, // 1時間（秒数）
      sameSite: "lax",
    });

    // response.cookies.set("accessToken", encryptedToken, {
    //   httpOnly: true,
    //   secure: true,
    //   path: "/",
    //   sameSite: "strict",
    //   maxAge: 24 * 60 * 60,
    // });
    return response;
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// import { NextResponse } from 'next/server';
// import { serialize } from 'cookie';
// import { NextRequest } from 'next/server';

// export async function POST(req: NextRequest) {
//   const { token, name, maxAge } = await req.json();
//   const cookie = serialize(name, token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'strict',
//     maxAge,
//     path: '/',
//   });

//   const response = NextResponse.json({ message: 'success' });
//   response.headers.set('Set-Cookie', cookie);
//   return response;
// }