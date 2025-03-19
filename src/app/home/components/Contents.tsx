"use client";
import "@/app/config/amplify/AmplifyConf";
import { useAuth } from "@/app/config/amplify/AuthProvider";
import { Crosshair, Flag, Shield } from "lucide-react";
import Chart from "@/app/home/components/Chart";
import React from "react";
import { useState } from "react";

export default function Contents() {
  const { username } = useAuth();
  const [userRank, setUserRank] = useState("");

  return (
    <div className="flex min-h-screen bg-black text-white">
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Welcome,{" "}
          <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            {username}
          </span>
        </h1>

        {/* Stat Card グリッド (レスポンシブ対応) */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard title="Problems Solved" value="42" icon={Crosshair} />
          <StatCard title="Current Rank" value={userRank} icon={Shield} />
          <StatCard title="Contests Entered" value="5" icon={Flag} />
        </div>

        {/* チャートコンポーネント */}
        <div className="flex flex-col items-center gap-6 w-full overflow-hidden">
          <Chart setUserRank={setUserRank} />
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon: Icon }: { title: string; value: string; icon: React.FC }) {
  return (
    <div className="bg-primary p-6 rounded-lg shadow-lg backdrop-blur-md w-full flex flex-col items-center text-center">
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon />}
        <h3 className="text-lg font-semibold text-gray-300">{title}</h3>
      </div>
      <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
        {value}
      </p>
    </div>
  );
}
