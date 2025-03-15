"use client";

import { useEffect, useState } from "react";

export default function PyodideRunner() {
    const [pyodide, setPyodide] = useState<any>(null);
    const [code, setCode] = useState("# Python code here");
    const [output, setOutput] = useState("");

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
        script.onload = async () => {
            // @ts-ignore
            const pyodideInstance = await window.loadPyodide();
            setPyodide(pyodideInstance);
        };
        document.body.appendChild(script);
    }, []);

    const runPython = async () => {
        if (!pyodide) return;

        try {
            pyodide.runPython(`
                import sys
                from io import StringIO

                # 標準出力をキャプチャ
                sys.stdout = StringIO()

                # ユーザーのコードを実行
                try:
                    exec(${JSON.stringify(code)})
                except Exception as e:
                    print("Error:", e)

                # 実行結果を取得
                result = sys.stdout.getvalue()
            `);

            setOutput(pyodide.globals.get("result"));
        } catch (error) {
            setOutput("Error: " + error);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">Python 実行環境 (Pyodide)</h1>

            {/* ユーザーのコード入力エリア */}
            <textarea
                className="w-full p-2 border rounded"
                rows={5}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="ここに Python コードを入力..."
            />

            {/* 実行ボタン */}
            <button className="mt-2 p-2 bg-blue-500 text-white rounded hover:cursor-pointer" onClick={runPython}>
                Run Python
            </button>

            {/* 実行結果表示 */}
            <div>
                <p>Output:</p>
                <pre className="mt-4 p-2 border rounded text-black">{output}</pre>
            </div>
        </div>
    );
}
