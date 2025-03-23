"use server"
import { cookies } from "next/headers";
import { decrypt } from "@/app/usecase/crypto/decrypt";


interface GetCookieUseCaseProps {
  name: string;
}

export default async function GetCookieUseCase({ name }: GetCookieUseCaseProps) {
  const cookie_store = await cookies();
  const token = cookie_store.get(name)?.value || "";
  const value = decrypt(token);
  return value;
}