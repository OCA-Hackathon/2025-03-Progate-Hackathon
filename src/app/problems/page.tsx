import Link from "next/link";
import { Crosshair } from "lucide-react";

export default function ProblemsPage() {
  // 20個のダミー問題データ
  const problems = [
    { id: "1", title: "Two Sum Problem" },
    { id: "2", title: "Dijkstra's Algorithm" },
    { id: "3", title: "Knapsack Problem" },
    { id: "4", title: "Floyd-Warshall Algorithm" },
    { id: "5", title: "Bellman-Ford Algorithm" },
    { id: "6", title: "Prim's Minimum Spanning Tree" },
    { id: "7", title: "Kruskal's Algorithm" },
    { id: "8", title: "Topological Sorting" },
    { id: "9", title: "Depth First Search (DFS)" },
    { id: "10", title: "Breadth First Search (BFS)" },
    { id: "11", title: "Binary Search" },
    { id: "12", title: "Longest Common Subsequence" },
    { id: "13", title: "Edit Distance" },
    { id: "14", title: "Maximum Subarray (Kadane's Algorithm)" },
    { id: "15", title: "Segment Tree Basics" },
    { id: "16", title: "Trie Data Structure" },
    { id: "17", title: "Union-Find Disjoint Sets" },
    { id: "18", title: "Convex Hull Algorithm" },
    { id: "19", title: "Bitmask Dynamic Programming" },
    { id: "20", title: "Graph Coloring Algorithm" },
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
                <p className="text-gray-400 text-sm">ID: {problem.id}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
