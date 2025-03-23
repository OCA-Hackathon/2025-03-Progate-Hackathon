"use client"

import { useParams } from "next/navigation";
import Code from "@/feature/problems/components/Code";
import ProblemDetail from "@/feature/problems/components/ProblemDetail";

export default function Problem() {
  const params = useParams();
  const problemId = params.id as string;
  return (
    <div className="flex text-white p-6 bg-black min-h-screen ">
      {/* <h1 className="text-2xl font-bold">Problem ID: {params.id}</h1> */}
      <ProblemDetail />
      <Code {...{problemId}}/>
    </div>
  );
}