"use server"
import { cookies } from "next/headers";

interface SetCookieUseCaseProps {
  name: string;
  value: string;
  maxAge: number;
}

export default async function setCookieUseCase({ name, value, maxAge }: SetCookieUseCaseProps) {
  const cookie_store = await cookies();
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