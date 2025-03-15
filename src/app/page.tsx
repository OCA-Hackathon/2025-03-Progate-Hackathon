import Link from "next/link";

export default function Home() {
  return (
<div className="min-h-screen bg-gradient-to-r from-black via-gray-800 to-black text-white flex flex-col items-center justify-center px-6">
      <h1 className="text-5xl font-extrabold text-center mb-6">Code Arena</h1>
      <p className="text-lg text-gray-300 text-center max-w-2xl">
        競技プログラミングのためのプラットフォーム。<br />スキルを磨き、世界中のコーダーと戦おう。
      </p>
      <div className="mt-8 flex space-x-4">
        <Link href="/login">
          <button className="bg-blue-600 hover:bg-blue-500 px-6 py-3 text-lg font-semibold rounded-lg shadow-md">
            LOGIN
          </button>
        </Link>
        <Link href="/register">
          <button className="bg-green-600 hover:bg-green-500 px-6 py-3 text-lg font-semibold rounded-lg shadow-md">
            REGISTER
          </button>
        </Link>
      </div>
    </div>
  );
}