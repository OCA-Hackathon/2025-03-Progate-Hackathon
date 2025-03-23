import LoginForm from "@/feature/auth/login/components/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'login',
};

export default function LoginPage() {
  return (
    <LoginForm/>
  );
}
