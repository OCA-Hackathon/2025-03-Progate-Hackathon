"use client";
import { useState, useEffect, useRef } from "react";
import * as echarts from "echarts";

// 仮データ（解いた日付と時刻 + スコア）
const userScores = [
  { datetime: "2024-03-10 10:00", score: 120 },
  { datetime: "2024-03-12 14:30", score: 300 },
  { datetime: "2024-03-15 09:15", score: 600 },
  { datetime: "2024-03-15 19:22", score: 700 },
  { datetime: "2024-03-18 20:45", score: 900 },
  { datetime: "2024-03-22 16:10", score: 1250 },
  { datetime: "2024-03-25 23:00", score: 1800 },
  { datetime: "2024-03-28 07:30", score: 2100 },
];

const getRank = (score: number) => {
  if (score >= 4000) return "Overlord";
  if (score >= 3000) return "Sentinel";
  if (score >= 2500) return "Elite Raider";
  if (score >= 2000) return "Pro Raider";
  if (score >= 1500) return "Raider";
  if (score >= 1000) return "Pioneer";
  if (score >= 500) return "Scout";
  return "Scout";
};


export default function RankingPage({ setUserRank }: { setUserRank: (rank: string) => void }) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(userScores[userScores.length - 1].score);
  const latestScore = userScores[userScores.length - 1].score;
  const userRank = getRank(latestScore);

  useEffect(() => {
    if (!chartRef.current) return;
    const chartInstance = echarts.init(chartRef.current);

    const backgroundBands = [
      { min: 0, max: 500, color: "rgba(220, 220, 220, 0.4)" },
      { min: 500, max: 1000, color: "rgba(57, 255, 20, 0.4)" },
      { min: 1000, max: 1500, color: "rgba(0, 255, 255, 0.4)" },
      { min: 1500, max: 2000, color: "rgba(30, 144, 255, 0.4)" },
      { min: 2000, max: 2500, color: "rgba(255, 215, 0, 0.4)" },
      { min: 2500, max: 3000, color: "rgba(255, 97, 3, 0.4)" },
      { min: 3000, max: 4000, color: "rgba(255, 0, 0, 0.4)" },
    ];

    setUserRank(userRank);

    const chartOptions = {
      title: {
        text: "Score Progress",
        textStyle: { color: "#fff", fontSize: 16 },
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "line" },
      },
      xAxis: {
        type: "category",
        data: userScores.map((entry) => entry.datetime),
        axisLabel: { color: "#fff", fontSize: 12 },
        axisLine: { lineStyle: { color: "#666" } },
      },
      yAxis: {
        type: "value",
        min: 0,
        max: 3500,
        interval: 1000,
        axisLabel: { color: "#fff", fontSize: 12 },
        splitLine: { lineStyle: { color: "#333" } },
      },
      series: [
        {
          name: "スコア",
          type: "line",
          data: userScores.map((entry) => entry.score),
          smooth: true,
          itemStyle: {
            color: "#9400D3",
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(0, 0, 0, 0)" },
              { offset: 1, color: "rgba(0, 0, 0, 0)" },
            ]),
          },
        },
      ],
      visualMap: [
        {
          show: false,
          type: "piecewise",
          dimension: 1,
          pieces: backgroundBands.map((band) => ({
            gt: band.min,
            lte: band.max,
            color: band.color,
          })),
        },
      ],
    };

    chartInstance.setOption(chartOptions);

    return () => {
      chartInstance.dispose();
    };
  }, [score]);

  return (
    <div className="place-items-center flex flex-col items-center justify-center mt-8 w-full">
      {/* 🔹 横スクロールを可能にする */}
      <div className="w-full max-w-4xl mt-8 overflow-x-auto overflow-hidden bg-black rounded-lg">
        <div
          ref={chartRef}
          style={{
            minWidth: "100%", // 🔹 これで親コンポーネントの幅に合わせる
            height: "500px",
          }}
        />
      </div>
    </div>
  );
}
