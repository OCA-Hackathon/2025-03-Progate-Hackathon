import { Timer, MemoryStick, Copy } from "lucide-react";

export default function ProblemDetail() {
    return (
        <div className="w-1/2 flex flex-col bg-primary p-4 rounded-tl-lg rounded-bl-lg">
            <h2 className="text-lg font-bold mb-4">問題文</h2>
            <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Two Sum</h3>
            <p className="mb-4">整数の配列 nums と整数 target が与えられたとき、その合計が target になる2つの数のインデックスを返します。</p>
            <p className="mb-4">各入力に対して常に一つの解が存在すると仮定し、同じ要素を2回使用することはできません。</p>
            </div>

            <div className="mb-6">
            <div className="flex items-center mb-2 gap-2">
                {/* <span className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-700 text-white mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                </span> */}
                <Timer size={24} />
                <span className="text-sm">実行時間: 2秒</span>
            </div>
            <div className="flex items-center gap-2">
                <MemoryStick size={24} />
                <span className="text-sm">メモリ制限: 1024MB</span>
            </div>
            </div>

            <div className="mb-6">
            <h3 className="font-semibold mb-2">制約</h3>
            <ul className="text-sm text-gray-300 space-y-1">
                <li>2 ≤ N ≤ 10<sup>3</sup></li>
                <li>1 ≤ P ≤ 10<sup>12</sup></li>
                <li>1 ≤ Q ≤ 10<sup>12</sup></li>
                <li>gcd(P, Q) = 1</li>
                <li>0 ≤ A<sub>i</sub> ≤ 10</li>
                <li>入力される値はすべて整数</li>
            </ul>
            </div>

            <div className="space-y-4">
            <div>
                <h3 className="font-semibold mb-2">サンプル</h3>
                <div className="bg-[#252525] p-3 rounded">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-400">入力例1</span>
                    <button className="text-xs text-gray-400 hover:text-white">
                        <Copy size={15} />
                    </button>
                </div>
                <pre className="text-sm">2 7 11 15 9</pre>
                </div>
            </div>

            <div className="bg-[#252525] p-3 rounded">
                <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400">出力例1</span>
                <button className="text-xs text-gray-400 hover:text-white">
                    <Copy size={15} />
                </button>
                </div>
                <pre className="text-sm">0 1</pre>
            </div>

            <div className="bg-[#252525] p-3 rounded">
                <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400">入力例2</span>
                <button className="text-xs text-gray-400 hover:text-white">
                    <Copy size={15} />
                </button>
                </div>
                <pre className="text-sm">3 2 4 6</pre>
            </div>

            <div className="bg-[#252525] p-3 rounded">
                <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400">出力例2</span>
                <button className="text-xs text-gray-400 hover:text-white">
                    <Copy size={15} />
                </button>
                </div>
                <pre className="text-sm">1 2</pre>
            </div>
            </div>
        </div>
    );
}