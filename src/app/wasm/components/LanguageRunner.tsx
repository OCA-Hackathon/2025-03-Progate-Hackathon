"use client";

import { useEffect, useState } from "react";

export default function LanguageRunner() {
    const [language, setLanguage] = useState("python");
    // runtimeはdecimal型になる可能性があるが、anyは使うな
    const [runtime, setRuntime] = useState<any>(null);
    const [code, setCode] = useState<{ [key: string]: string }>({
        python: "print('Hello, Pyodide!')",
        c: `#include <stdio.h>
int main() {
    printf("Hello from C!\\n");
    return 0;
}`,
        go: `package main
import "fmt"
func main() {
    fmt.Println("Hello from Go!")
}`,
    });
    const [output, setOutput] = useState("");

    useEffect(() => {
        if (language === "python") {
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
            script.onload = async () => {
                // @ts-ignore
                const pyodideInstance = await window.loadPyodide();
                setRuntime(pyodideInstance);
            };
            document.body.appendChild(script);
        } else if (language === "c") {
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/wasm-terminal@0.10.0/dist/index.umd.min.js";
            script.onload = async () => {
                // @ts-ignore
                const WasmTerminal = window.WasmTerminal;
                setRuntime(new WasmTerminal());
            };
            document.body.appendChild(script);
        } else if (language === "go") {
            const script = document.createElement("script");
            script.src = "https://golang.org/dl/go1.18.wasm";
            script.onload = async () => {
                // @ts-ignore
                const go = new window.Go();
                const wasm = await WebAssembly.instantiateStreaming(fetch("https://golang.org/dl/go1.18.wasm"), go.importObject);
                go.run(wasm.instance);
                setRuntime(go);
            };
            document.body.appendChild(script);
        }
    }, [language]);

    const runCode = async () => {
        if (!runtime) return;
        setOutput("");

        if (language === "python") {
            try {
                // runtime.runPython(`
                const result = runtime.runPython(`
                    import time
                    import sys
                    from io import StringIO
                    sys.stdout = StringIO()
                    try:
                        start_time = time.perf_counter()
                        exec(${JSON.stringify(code.python)})
                    except Exception as e:
                        print("Error:", e)
                    end_time = time.perf_counter()
                    execution_time = end_time - start_time
                    result = sys.stdout.getvalue()
                    "Execution Time: {:.6f} s\\n\\n".format(execution_time) + result
                `);
                // setOutput(runtime.globals.get("result"));
                setOutput(result);
            } catch (error) {
                setOutput("Error: " + error);
            }
        } else if (language === "c") {
            try {
                setOutput("C の WebAssembly 実行は現在開発中...");
            } catch (error) {
                setOutput("Error: " + error);
            }
        } else if (language === "go") {
            try {
                setOutput("Go の WebAssembly 実行は現在開発中...");
            } catch (error) {
                setOutput("Error: " + error);
            }
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">多言語 WebAssembly 実行環境</h1>

            {/* 言語選択 */}
            <select
                className="w-full p-2 border rounded"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
            >
                <option value="python">Python</option>
                <option value="c">C</option>
                <option value="go">Go</option>
            </select>

            {/* ユーザーのコード入力エリア */}
            <textarea
                className="w-full p-2 border rounded mt-2"
                rows={5}
                value={code[language] as string}
                onChange={(e) =>
                    setCode({ ...code, [language]: e.target.value })
                }
                placeholder="ここにコードを入力..."
            />

            {/* 実行ボタン */}
            <button
                className="mt-2 p-2 bg-blue-500 text-white rounded"
                onClick={runCode}
            >
                Run
                {/* Run {language.toUpperCase()} */}
            </button>

            {/* 実行結果表示 */}
            <div>
                <p>Output:</p>
                <pre className="mt-4 p-2 text-white border rounded">{output}</pre>
            </div>
        </div>
    );
}
