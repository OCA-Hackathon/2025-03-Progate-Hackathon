"use client";
import { useState, useEffect } from "react";
import Button from "@/app/components/ui/Button";
import { useAuth } from "@/app/config/amplify/AuthProvider";
import Editor from "@monaco-editor/react";

interface CodeProps {
  problemId: string;
}

interface Result {
  submission_timestamp: string;
  overall_status: string;
  results: {
    test_case_number: number;
    status: string;
    execution_time: number;
    memory_kb: number;
    input: string;
    expected_output: string;
    actual_output: string;
  }[];
  message?: string;
}

interface LoadingMessageUpdater {
  (message: string): void;
}

interface LoadingStep {
  stepId: string;
}


export default function Code({ problemId }: CodeProps) {
  const [language, setLanguage] = useState('go');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [currentStep, setCurrentStep] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const statusMap = {
    AC: 'Accepted',
    WA: 'Wrong Answer',
    TLE: 'Time Limit Exceeded',
    RE: 'Runtime Error',
  };
  const { username } = useAuth();

  const getSampleCode = () => {
    switch (language) {
      case 'python':
        return `def two_sum(nums, target):\n  # Your solution here\n  return [0, 0]`;
      case 'go':
        return `func twoSum(nums []int, target int) []int {\n  // Your solution here\n  return []int{0, 0}\n}`;
      case 'rust':
        return `fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {\n  // Your solution here\n  vec![0, 0]\n}`;
      case 'cpp':
        return `std::vector<int> twoSum(std::vector<int>& nums, int target) {\n  // Your solution here\n  return {0, 0};\n}`;
      default:
        return `// Write your solution for ${language} here`;
    }
  };

  const updateLoadingStep = (stepId: LoadingStep['stepId']) => {
    setCurrentStep(stepId);
  };
  const updateLoadingMessage: LoadingMessageUpdater = (message) => {
    setLoadingMessage(message);
  };

  useEffect(() => {
    setCode(getSampleCode());
  }, [language]);

  const handleEditorChange = (newValue: string | undefined) => {
    if (newValue !== undefined) {
      setCode(newValue);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    updateLoadingStep('results');
    updateLoadingMessage('Processing...');

    // upload code to S3
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          problemId,
          code,
          language,
        }),
      });
      if (response.ok) {
        console.log('Message sent to SQS successfully');
      } else {
        console.log('Error submitting code with SQS');
      }
    } catch (error) {
      console.log('Error submitting code');
      setLoading(false);
    }
  
    // poll for results
    try{
      const response = await fetch('/api/result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          problemId,
        }),
      });
      if (response.ok) {
        console.log('Fetching results successfully');
        const data = await response.json();
        const result = data.result;
        setResult(result);
        console.log('Result:', result);
      } else {
        console.log('Error fetching results');
      }
    } catch (error) {
      console.log('Error fetching results');
      setLoading(false);
    }
    setLoading(false);
  };


  interface StartResultPollingParams {
    bucket: string;
    userId: string;
    problemId: string;
    timestamp: number;
  }

  return (
    <div className="w-1/2 flex flex-col bg-primary rounded-br-lg rounded-tr-lg p-4">
      <div className="flex items-center mb-4">
        <div className="flex-1">
        </div>
        <div className="flex-1 text-right">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-[#252525] text-white px-3 py-2 rounded"
          >
            <option value="go">Go</option>
            <option value="python">Python</option>
            <option value="rust">Rust</option>
            <option value="cpp">C++</option>
          </select>
        </div>
      </div>
      {/* <textarea
      value={code}
      onChange={(e) => setCode(e.target.value)}
      className="w-full h-[80%] bg-[#252525] text-gray-100 font-mono text-sm p-4 rounded resize-none mb-4
      border-2 border-transparent bg-clip-border focus:outline-none focus:ring-2 focus:ring-transparent
      focus:border-gradient-to-r from-purple-500 to-blue-500"
      placeholder="Write your solution here..."
      ></textarea> */}

      <Editor
        height="50vh"
        defaultLanguage={language}
        language={language}
        value={code}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />

    <div className="min-w-3xs mx-auto mt-4 mb-4 flex items-center justify-center space-x-2">
    <Button onClick={handleSubmit} disabled={loading}>
    {loading ? (
      <div className="flex items-center space-x-2">
        <svg
          className="animate-spin h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span>Processing...</span>
      </div>
    ) : (
      "SUBMIT"
    )}
</Button>

    </div>


      {/* 結果表示 */}
      {result && (
        <div className="bg-[#252525] rounded-lg overflow-hidden">
          <div className={`p-3 font-bold text-white ${result.overall_status === 'AC' ? 'bg-green-600' : result.overall_status === 'WA' ? 'bg-red-600' : result.overall_status === 'TLE' ? 'bg-yellow-600' : result.overall_status === 'RE' ? 'bg-purple-600' : 'bg-gray-600'}`}>
            Result: {result.overall_status ? statusMap[result.overall_status as keyof typeof statusMap] || result.overall_status : 'Unknown Status'}
          </div>
          <div className="p-4">
            {result.submission_timestamp && (
              <div className="mb-4 text-sm text-gray-400">
                <span>提出タイムスタンプ: {result.submission_timestamp}</span>
              </div>
            )}

            {result.results && result.results.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#333333]">
                      <th className="p-2 text-left">Test #</th>
                      <th className="p-2 text-left">Status</th>
                      <th className="p-2 text-left">Time (ms)</th>
                      <th className="p-2 text-left">Memory</th>
                      <th className="p-2 text-left">Input</th>
                      <th className="p-2 text-left">Expected</th>
                      <th className="p-2 text-left">Output</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.results.map((testResult, index) => (
                      <tr key={index} className={`${testResult.status === 'AC' ? 'bg-green-900 bg-opacity-20' : testResult.status === 'WA' ? 'bg-red-900 bg-opacity-20' : 'bg-[#333333]'} border-t border-[#333333]`}>
                        <td className="p-2">{testResult.test_case_number}</td>
                        <td className="p-2">{statusMap[testResult.status as keyof typeof statusMap] || testResult.status}</td>
                        <td className="p-2">{testResult.execution_time}</td>
                        <td className="p-2">{testResult.memory_kb}</td>
                        <td className="p-2 font-mono text-xs whitespace-pre">{testResult.input || ''}</td>
                        <td className="p-2 font-mono text-xs whitespace-pre">{testResult.expected_output || ''}</td>
                        <td className="p-2 font-mono text-xs whitespace-pre">{testResult.actual_output || ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : result.message ? (
              <p>{result.message}</p>
            ) : (
              <p>No result details available</p>
            )}
          </div>
        </div>
      )}
    </div>
    );
}