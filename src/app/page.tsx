import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1C1C1C] text-white flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-10 left-10 text-purple-500 opacity-30 text-sm font-mono">
            {`for(int i=0; i<n; i++) {`}<br />
            {`  if(solve()){`}<br />
            {`    score++;`}<br />
            {`  }`}<br />
            {`}`}
          </div>
          <div className="absolute bottom-10 right-10 text-blue-400 opacity-30 text-sm font-mono">
            {`class Solution {`}<br />
            {`  public int compete() {`}<br />
            {`    return best;`}<br />
            {`  }`}<br />
            {`}`}
          </div>
        </div>
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-purple-600 rounded-full filter blur-[150px] opacity-20"></div>
        <div className="absolute bottom-1/3 -right-1/4 w-1/2 h-1/2 bg-blue-600 rounded-full filter blur-[150px] opacity-20"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-4 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
          WELCOME TO
        </div>

        <h1 className="text-6xl sm:text-7xl font-extrabold text-center mb-8 tracking-tight">
          <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-500 to-purple-400">
            Code Arena
          </span>
        </h1>
        <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-8"></div>

        <p className="text-xl text-gray-300 text-center max-w-xl mb-4">
          <span className="font-semibold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
            SHARPEN YOUR SKILLS. CONQUER THE CHALLENGE.
          </span>
        </p>

        <p className="text-lg text-gray-400 text-center max-w-xl mb-10">
          Code Arena is a platform for coders to practice their skills, compete with others, and push your limits.
        </p>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
          <Link href="/login">
            <button className="px-8 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-900/20 transition-all duration-300 transform hover:scale-105 active:scale-95 min-w-[180px] hover:cursor-pointer">
              LOGIN
            </button>
          </Link>
          <Link href="/register">
            <button className="px-8 py-4 text-lg font-semibold rounded-xl bg-[#252525] border border-[#333333] hover:bg-[#2a2a2a] shadow-lg shadow-blue-900/10 transition-all duration-300 transform hover:scale-105 active:scale-95 min-w-[180px] hover:cursor-pointer">
              REGISTER
            </button>
          </Link>
        </div>

        <div className="mt-16 flex items-center space-x-4 text-gray-500">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
            <span>65535 Online Coders</span>
          </div>
          <span>•</span>
          <div>Daily Challenges</div>
          <span>•</span>
          <div>Global Leaderboard</div>
        </div>
      </div>
    </div>
  );
}