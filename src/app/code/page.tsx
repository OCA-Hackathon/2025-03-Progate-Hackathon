import { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

export default function CodeEditor() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");

  const runCode = async () => {
    const response = await axios.post("/api/run-code", {
      code,
      language,
    });
    setOutput(response.data.output);
  };

  return (
    <div>
      <select onChange={(e) => setLanguage(e.target.value)} value={language}>
        <option value="python">Python</option>
        <option value="javascript">JavaScript</option>
        <option value="cpp">C++</option>
      </select>
      <Editor
        height="400px"
        defaultLanguage="python"
        language={language}
        value={code}
        onChange={(value) => setCode(value || "")}
      />
      <button onClick={runCode}>Run</button>
      <pre>{output}</pre>
    </div>
  );
}
