import { Timer, MemoryStick, Copy } from "lucide-react";

export default function ProblemDetail() {
    return (
        <div className="w-1/2 flex flex-col bg-primary p-4 rounded-tl-lg rounded-bl-lg">
            {/* 問題名 */}
            <h2 className="text-lg font-bold mb-4">問題文</h2>

            <div className="mb-6">
                {/* 「Two Sum」というタイトルをそのまま残す */}
                <h3 className="text-xl font-semibold mb-2">Two Sum</h3>
                
                {/* 以下の説明を「2つの整数の合計を求める」問題に変更 */}
                <p className="mb-4">
                    2つの整数が与えられるので、それらの合計を求めて出力してください。
                </p>
                <p className="mb-4">
                    例えば、入力が <strong>2 7</strong> の場合、出力は <strong>9</strong> となります。
                </p>
            </div>

            {/* 実行時間 / メモリ制限 (例として仮置き) */}
            <div className="mb-6">
                <div className="flex items-center mb-2 gap-2">
                    <Timer size={24} />
                    <span className="text-sm">実行時間: 2秒</span>
                </div>
                <div className="flex items-center gap-2">
                    <MemoryStick size={24} />
                    <span className="text-sm">メモリ制限: 1024MB</span>
                </div>
            </div>

            {/* 制約 (仮置き) */}
            <div className="mb-6">
                <h3 className="font-semibold mb-2">制約</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                    <li>-10<sup>9</sup> ≤ A<sub>1</sub>, A<sub>2</sub> ≤ 10<sup>9</sup></li>
                    <li>入力される値はすべて整数</li>
                </ul>
            </div>

            {/* サンプル入出力例 */}
            <div className="space-y-4">
                {/* 入力例1 */}
                <div>
                    <h3 className="font-semibold mb-2">サンプル</h3>
                    <div className="bg-[#252525] p-3 rounded">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-400">入力例1</span>
                            <button className="text-xs text-gray-400 hover:text-white">
                                <Copy size={15} />
                            </button>
                        </div>
                        <pre className="text-sm">2 7</pre>
                    </div>
                </div>

                {/* 出力例1 */}
                <div className="bg-[#252525] p-3 rounded">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-400">出力例1</span>
                        <button className="text-xs text-gray-400 hover:text-white">
                            <Copy size={15} />
                        </button>
                    </div>
                    <pre className="text-sm">9</pre>
                </div>

                {/* 入力例2 */}
                <div className="bg-[#252525] p-3 rounded">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-400">入力例2</span>
                        <button className="text-xs text-gray-400 hover:text-white">
                            <Copy size={15} />
                        </button>
                    </div>
                    <pre className="text-sm">-5 10</pre>
                </div>

                {/* 出力例2 */}
                <div className="bg-[#252525] p-3 rounded">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-400">出力例2</span>
                        <button className="text-xs text-gray-400 hover:text-white">
                            <Copy size={15} />
                        </button>
                    </div>
                    <pre className="text-sm">5</pre>
                </div>
            </div>
        </div>
    );
}
