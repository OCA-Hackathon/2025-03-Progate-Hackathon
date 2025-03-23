"use server"
import { cookies } from "next/headers";
import { encrypt } from "@/app/usecase/crypto/encrypt";


interface SetCookieUseCaseProps {
  name: string;
  token: string;
  maxAge: number;
}

export default async function setCookieUseCase({ name, token, maxAge }: SetCookieUseCaseProps) {
  const cookie_store = await cookies();
  const value = encrypt(token);
  cookie_store.set({
    name,
    value,
    maxAge,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  });
}