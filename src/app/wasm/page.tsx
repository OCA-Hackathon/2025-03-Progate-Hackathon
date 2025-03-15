import PyodideRunner from "./components/PyodideRunner";
import LanguageRunner from "./components/LanguageRunner";

export default function Home() {
    return (
        <div className="max-w-7xl mx-auto mt-10">
            <h1 className="text-2xl font-bold">Pyodide Python Playground</h1>
            <div className="flex mt-11">
                <div className="max-w-2xl">
                    <h2 className="text-xl font-bold">Python とは？</h2>
                    <p>
                        Python は、1991年に Guido van Rossum によって開発されたプログラミング言語です。
                        Python は、シンプルで読みやすい構文を持ち、多くのライブラリが提供されているため、
                        機械学習やデータ分析、Web 開発など、幅広い用途で利用されています。
                    </p>
                </div>
              <LanguageRunner />
            </div>
        </div>
    );
}
