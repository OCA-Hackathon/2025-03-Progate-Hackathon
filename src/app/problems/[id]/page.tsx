"use client";
import { useParams } from "next/navigation";

export default function ProblemPage() {
  const params = useParams();
    return (
      <div className="text-white p-6 bg-black min-h-screen">
        <h1 className="text-2xl font-bold">Problem ID: {params.id}</h1>
        <p>問題の詳細をここに表示</p>
      </div>
    );
  }