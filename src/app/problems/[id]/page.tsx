import Problem from "@/feature/problems/components/Problem";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Problem',
};

export default function ProblemPage() {
  return <Problem/>
}