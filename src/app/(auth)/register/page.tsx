import RegisterForm from "@/feature/auth/register/components/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Register',
};

export default function RegisterPage() {
  return (
    <RegisterForm/>
  );
}
