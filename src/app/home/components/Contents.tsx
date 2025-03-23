"use client";
import "@/config/amplify/AmplifyConf";
import { useAuth } from "@/app/config/amplify/AuthProvider";
import { Crosshair, Flag, Shield, CircleHelp, Skull, ShieldAlert, Flame, Swords, Medal, ScrollText, Hammer } from "lucide-react";
import Chart from "@/app/home/components/Chart";
import React, { useState } from "react";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.FC;
}

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

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard title="Problems Solved" value="42" icon={Crosshair} />
          <StatCard title="Current Rank" value={userRank} icon={Shield} />
          <StatCard title="Contests Entered" value="5" icon={Flag} />
        </div>

        {/* Chart */}
        <div className="flex flex-col items-center gap-6 w-full overflow-hidden">
          <Chart setUserRank={setUserRank} />
        </div>
      </div>
    </div>
  );
}


function StatCard({ title, value, icon: Icon }: StatCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const ranks = [
    { name: "Overlord", min: 4000, icon: Skull, color: "rgba(255, 0, 0, 0.8)" }, // 赤
    { name: "Sentinel", min: 3000, icon: ShieldAlert, color: "rgba(255, 97, 3, 0.8)" }, // オレンジ
    { name: "Elite Raider", min: 2000, icon: Flame, color: "rgba(255, 215, 0, 0.8)" }, // ゴールド
    { name: "Pro Raider", min: 1500, icon: Swords, color: "rgba(30, 144, 255, 0.8)" }, // 青
    { name: "Raider", min: 1000, icon: Medal, color: "rgba(0, 255, 255, 0.8)" }, // シアン
    { name: "Pioneer", min: 500, icon: ScrollText, color: "rgba(57, 255, 20, 0.8)" }, // ライム
    { name: "Scout", min: 0, icon: Hammer, color: "rgba(220, 220, 220, 0.8)" }, // シルバー
  ];

  return (
    <div className="relative bg-primary p-6 rounded-lg shadow-lg backdrop-blur-md w-full flex flex-col items-center text-center">
      {title === "Current Rank" && (
        <div className="absolute top-2 right-2">
          <CircleHelp
            size={20}
            className="text-gray-400 hover:text-white cursor-pointer"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => setShowTooltip(!showTooltip)}
          />

          {/* ツールチップ表示 */}
          {showTooltip && (
            <div className="absolute right-0 mt-2 w-48 p-2 bg-[#252525] text-white text-sm rounded-lg shadow-lg z-10">
              {/* <p>About Rank:</p> */}
              <ul className="text-white space-y-2">
                {ranks.map(({ name, min, icon: Icon, color }) => (
                  <li key={name} className="flex items-center space-x-3">
                    <Icon size={20} style={{ color }} />
                    <span style={{ color }}>{name}</span>
                    <span className="text-gray-400">: {min}+</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* アイコン & タイトル */}
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon />}
        <h3 className="text-lg font-semibold text-gray-300">{title}</h3>
      </div>

      {/* スコア */}
      <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
        {value}
      </p>
    </div>
  );
}
