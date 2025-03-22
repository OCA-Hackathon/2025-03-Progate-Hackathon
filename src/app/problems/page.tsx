import Link from "next/link";
import { Crosshair } from "lucide-react";
import DifficultyBadge from "@/app/problems/components//DifficultyBadge";
import RatingBadge from "@/app/problems/components//RatingBadge";

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  rating: number;
}

export default function ProblemsPage() {
  const problems: Problem[] = [
    { id: "100", title: "Two Sum Problem", difficulty: "easy", rating: 5 },
    { id: "2", title: "Dijkstra's Algorithm", difficulty: "medium", rating: 4 },
    { id: "3", title: "Knapsack Problem", difficulty: "medium", rating: 3 },
    { id: "4", title: "Floyd-Warshall Algorithm", difficulty: "medium", rating: 3 },
    { id: "5", title: "Bellman-Ford Algorithm", difficulty: "medium", rating: 4 },
    { id: "6", title: "Prim's Minimum Spanning Tree", difficulty: "medium", rating: 2 },
    { id: "7", title: "Kruskal's Algorithm", difficulty: "medium", rating: 4 },
    { id: "8", title: "Topological Sorting", difficulty: "medium", rating: 5 },
    { id: "9", title: "Depth First Search (DFS)", difficulty: "easy", rating: 4 },
    { id: "10", title: "Breadth First Search (BFS)", difficulty: "easy", rating: 3 },
    { id: "11", title: "Binary Search", difficulty: "easy", rating: 4 },
    { id: "12", title: "Longest Common Subsequence", difficulty: "medium", rating: 3 },
    { id: "13", title: "Edit Distance", difficulty: "medium", rating: 2 },
    { id: "14", title: "Maximum Subarray (Kadane's Algorithm)", difficulty: "easy", rating: 4 },
    { id: "15", title: "Segment Tree Basics", difficulty: "hard", rating: 4 },
    { id: "16", title: "Trie Data Structure", difficulty: "medium", rating: 2 },
    { id: "17", title: "Union-Find Disjoint Sets", difficulty: "medium", rating: 4 },
    { id: "18", title: "Convex Hull Algorithm", difficulty: "hard", rating: 2 },
    { id: "19", title: "Bitmask Dynamic Programming", difficulty: "hard", rating: 1 },
    { id: "20", title: "Graph Coloring Algorithm", difficulty: "hard", rating: 3 },
  ];

  return (
    <div className="flex text-white bg-black min-h-screen">
      <div className="flex-1 p-8">
        {/* ヘッダー */}
        <div className="flex items-center gap-3 justify-center mb-6">
          <Crosshair size={24} />
          <h1 className="text-3xl font-bold text-center">Problems</h1>
        </div>

        {/* 問題一覧カード表示 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {problems.map((problem) => (
            <Link
              key={problem.id}
              href={`/problems/${problem.id}`}
              className="group relative p-[1px] rounded-lg transition-all transform hover:scale-105 active:scale-95"
            >
              {/* グラデーションボーダー (hover で発動) */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* 内側のコンテンツ */}
              <div className="relative bg-[#1c1c1c] p-6 rounded-lg shadow-lg z-10">
                <h2 className="text-lg font-semibold transition-all bg-gradient-to-r from-white to-white bg-clip-text text-transparent
                              group-hover:from-purple-400 group-hover:to-blue-500">
                  {problem.title}
                </h2>
                {/* <p className="text-gray-400 text-sm">ID: {problem.id}</p> */}
                <div className="absolute top-1 right-1">
                  <RatingBadge rating={problem.rating} />
                </div>
                {/* <DifficultyBadge difficulty={problem.difficulty} /> */}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
