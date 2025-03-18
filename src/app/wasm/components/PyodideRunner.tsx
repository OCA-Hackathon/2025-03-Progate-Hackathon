"use client";

import { useEffect, useState } from "react";

export default function PyodideRunner() {
    const [pyodide, setPyodide] = useState<any>(null);
    const [code, setCode] = useState("# Python code here\nprint(\"Hello, World!\")\n\n# 計算例\nresult = 5 * 10\nprint(f\"5 * 10 = {result}\")");
    const [output, setOutput] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
        script.onload = async () => {
            setIsLoading(true);
            try {
                // @ts-ignore
                const pyodideInstance = await window.loadPyodide();
                setPyodide(pyodideInstance);
            } catch (error) {
                console.error("Pyodide loading error:", error);
            } finally {
                setIsLoading(false);
            }
        };
        document.body.appendChild(script);
    }, []);

    const runPython = async () => {
        if (!pyodide) return;
        setOutput("実行中...");

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

    return(
        <div className="flex flex-col h-full bg-[#1e1e1e] text-gray-300 rounded-lg shadow-xl">
            {/* Editor top bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-[#3c3c3c]">
                <div className="flex items-center">
                    <div className="text-sm font-medium text-blue-400">main.py</div>
                    <div className="ml-2 px-2 py-1 bg-[#1e1e1e] text-xs rounded-sm">Python</div>
                </div>
                <div className="text-xs text-gray-500">Pyodide v0.24.1</div>
            </div>
    
            {/* Editor content area */}
            <div className="flex flex-1 overflow-hidden">
                {/* Line numbers */}
                <div className="hidden sm:block py-2 px-2 text-right bg-[#1e1e1e] text-gray-600 border-r border-[#3c3c3c] select-none w-12">
                    {code.split('\n').map((_, i) => (
                        <div key={i} className="text-xs leading-6">{i + 1}</div>
                    ))}
                </div>
    
                {/* Code input */}
                <div className="flex-1">
                    <textarea
                        className="w-full h-64 p-2 bg-[#1e1e1e] text-gray-200 border-0 resize-none focus:ring-0 focus:outline-none font-mono"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Python code here..."
                        spellCheck="false"
                    />
                </div>
            </div>
    
            {/* Control panel */}
            <div className="px-4 py-2 bg-[#252526] border-t border-b border-[#3c3c3c] flex items-center">
                <button
                    className="px-3 py-1 bg-[#0e639c] hover:bg-[#1177bb] text-white rounded text-sm font-medium flex items-center"
                    onClick={runPython}
                    disabled={isLoading || !pyodide}
                >
                    {isLoading ? (
                        <span className="flex items-center">
                            <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Loading...
                        </span>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                            Run
                        </>
                    )}
                </button>
                <div className="ml-4 text-xs text-gray-500">
                    {isLoading ? "Pyodide loading..." : (pyodide ? "Pyodide ready" : "Pyodide not loaded")}
                </div>
            </div>
    
            {/* Output area */}
            <div className="flex-1 p-4 bg-[#252526]">
                <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-gray-300">Output:</div>
                    <button 
                        className="text-xs text-gray-500 hover:text-gray-300" 
                        onClick={() => setOutput("")}
                    >
                        Clear
                    </button>
                </div>
                <pre className="p-3 bg-[#1e1e1e] text-gray-200 rounded border border-[#3c3c3c] font-mono text-sm overflow-auto h-24">
                    {output || 'Code execution output will appear here...'}
                </pre>
            </div>
        </div>
    );
}