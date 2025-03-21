'use client';
import React, { useState, useEffect } from 'react';
import Button from '@/app/components/ui/Button';
import AWS from "aws-sdk";

interface AWSConfProps {
    bucket: string;
    region: string;
    accessKey: string;
    secretAccessKey: string;
}

export default function Code({bucket, region, accessKey, secretAccessKey}: AWSConfProps) {
  const [userId, setUserId] = useState('towa123');
  const [code, setCode] = useState('');
  const [problemId, setProblemId] = useState('100');
  const [language, setLanguage] = useState('go');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('処理中...');
  interface Result {
    overall_status: string;
    submission_timestamp?: string;
    results?: Array<{
      test_case_number: number;
      status: string;
      execution_time: number;
      memory_kb: number;
      input?: string;
      expected_output?: string;
      actual_output?: string;
    }>;
    message?: string;
  }

  const [result, setResult] = useState<Result | null>(null);
  const [pollingIntervalId, setPollingIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [submissionKey, setSubmissionKey] = useState('');
  const [showSettingsModal, setShowSettingsModal] = useState(false);


  // サンプルコードを取得する関数
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

  // 言語選択変更時のハンドラ
  useEffect(() => {
    setCode(getSampleCode());
  }, [language]);

interface LoadingStep {
    stepId: string;
}

const updateLoadingStep = (stepId: LoadingStep['stepId']) => {
    setCurrentStep(stepId);
};

  // ローディングメッセージの更新
interface LoadingMessageUpdater {
    (message: string): void;
}

const updateLoadingMessage: LoadingMessageUpdater = (message) => {
    setLoadingMessage(message);
};

  // コード提出処理
  const submitCode = async () => {
    try {
      // ローディング表示の準備
      setLoading(true);
      setResult(null);
      
      // ステップ表示を初期化
      updateLoadingStep('submit');
      updateLoadingMessage('コードを提出中...');
      
      // AWS設定
      AWS.config.update({
        region: region,
        credentials: new AWS.Credentials({
          accessKeyId: accessKey,
          secretAccessKey: secretAccessKey
        })
      });

      const s3 = new AWS.S3();
      const timestamp = new Date().getTime();
      const fileExt = {'go':'go','python':'py','rust':'rs','cpp':'cpp'}[language] || 'txt';
      const newSubmissionKey = `submissions/${userId}/${problemId}/${timestamp}.${fileExt}`;
      setSubmissionKey(newSubmissionKey);

      console.log(`Submitting code with timestamp: ${timestamp}`);

      await s3.putObject({
        Bucket: bucket,
        Key: newSubmissionKey,
        Body: code,
        ContentType: 'text/plain'
      }).promise();

      // コード提出完了
      updateLoadingStep('init');
      updateLoadingMessage('タスクを起動中...');

      // タスク起動に少し時間がかかることを考慮
      setTimeout(() => {
        updateLoadingStep('execute');
        updateLoadingMessage('コードを実行中...');

        // さらに実行に時間がかかることを考慮
        setTimeout(() => {
          updateLoadingStep('results');
          updateLoadingMessage('結果を取得中...');

          // 結果のポーリングを開始
          startResultPolling({bucket, userId, problemId, timestamp});
        }, 10000); // コード実行ステップの表示時間
      }, 60000); // タスク起動ステップの表示時間

    } catch (error) {
      console.error('Error:', error);
      if (error instanceof Error) {
        alert('Error: ' + error.message);
      } else {
        alert('An unknown error occurred');
      }
      setLoading(false);
    }
  };

  interface ResultPolling {
    bucket: string,
    userId: string,
    problemId: string,
    timestamp: number
  }

  // 結果ポーリング関数
interface StartResultPollingParams {
    bucket: string;
    userId: string;
    problemId: string;
    timestamp: number;
}

interface S3Result {
    Body?: AWS.S3.Body;
}

interface S3ListResult {
    Contents?: Array<{
        Key?: string;
        LastModified?: Date;
    }>;
}

const startResultPolling = ({ bucket, userId, problemId, timestamp }: StartResultPollingParams) => {
    if (pollingIntervalId) clearInterval(pollingIntervalId);

    let attempts = 0;
    const maxAttempts = 5; // 最大試行回数

    // 開始時の待機時間を表示
    updateLoadingMessage(`結果を取得中... (0/${maxAttempts})`);

    const intervalId = setInterval(async () => {
        attempts++;

        // 進捗を更新
        updateLoadingMessage(`結果を取得中... (${attempts}/${maxAttempts})`);

        try {
            // S3クライアントを再作成
            const s3 = new AWS.S3();

            // まずlatest.jsonを試す（最も確実な方法）
            const latestKey = `results/${userId}/${problemId}/latest.json`;
            console.log(`Trying to fetch: ${latestKey}`);

            try {
                const resultData: S3Result = await s3.getObject({
                    Bucket: bucket,
                    Key: latestKey
                }).promise();

                console.log('Found latest.json');
                const result = JSON.parse(resultData.Body?.toString() || '{}');

                // 内容を確認（デバッグ用）
                console.log('latest.json content:', result);

                // 結果を設定
                setResult(result);
                clearInterval(intervalId);
                setPollingIntervalId(null);
                setLoading(false);
                return;
            } catch (err) {
                console.log(`Failed to fetch latest.json`);

                // latest.jsonが見つからない場合、ディレクトリ内のファイルを全てリスト
                try {
                    console.log(`Listing files in results/${userId}/${problemId}/`);
                    const listResult: S3ListResult = await s3.listObjectsV2({
                        Bucket: bucket,
                        Prefix: `results/${userId}/${problemId}/`,
                        MaxKeys: 50
                    }).promise();

                    if (listResult.Contents && listResult.Contents.length > 0) {
                        console.log('Files found in directory:',
                            listResult.Contents.map(item => item.Key));

                        // LastModifiedで最新のものを取得（latest.jsonを除く）
                        const resultFiles = listResult.Contents
                            .filter(item => !item.Key?.endsWith('/latest.json'))
                            .sort((a, b) => new Date(b.LastModified || 0).getTime() - new Date(a.LastModified || 0).getTime());

                        if (resultFiles.length > 0) {
                            const latestFile = resultFiles[0];
                            console.log(`Trying most recent file: ${latestFile.Key}`);

                            const fileData: S3Result = await s3.getObject({
                                Bucket: bucket,
                                Key: latestFile.Key || ''
                            }).promise();

                            const result = JSON.parse(fileData.Body?.toString() || '{}');
                            console.log('Found result in most recent file');

                            setResult(result);
                            clearInterval(intervalId);
                            setPollingIntervalId(null);
                            setLoading(false);
                            return;
                        }
                    } else {
                        console.log('No files found in directory');
                    }
                } catch (listErr) {
                    console.log(`Error listing files`);
                }
            }

            // 最大試行回数に達した場合
            if (attempts >= maxAttempts) {
                updateLoadingMessage('タイムアウト - 結果を取得できませんでした');
                clearInterval(intervalId);
                setPollingIntervalId(null);
                setLoading(false);
                alert('結果の取得がタイムアウトしました。S3バケットを直接確認してください。');
            }
        } catch (error) {
            console.error('Polling error:', error);

            if (attempts >= maxAttempts) {
                updateLoadingMessage('エラーが発生しました');
                clearInterval(intervalId);
                setPollingIntervalId(null);
                setLoading(false);
                alert('結果確認中にエラーが発生しました');
            }
        }
    }, 2000); // 2秒ごとにポーリング

    setPollingIntervalId(intervalId);
};

  // HTMLエスケープ用のヘルパー関数
const escapeHtml = (text: string): string => {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

  // ステータスマッピング
  const statusMap = {
    'AC': 'All Test Cases Passed',
    'WA': 'Wrong Answer',
    'TLE': 'Time Limit Exceeded',
    'RE': 'Runtime Error',
    'CE': 'Compilation Error'
  };

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
            <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-[80%] bg-[#252525] text-gray-100 font-mono text-sm p-4 rounded resize-none mb-4
            border-2 border-transparent bg-clip-border focus:outline-none focus:ring-2 focus:ring-transparent
            focus:border-gradient-to-r from-purple-500 to-blue-500"
            placeholder="Write your solution here..."
            ></textarea>

            <div className="min-w-3xs mx-auto">

                <Button text="SUBMIT" onClick={submitCode} disabled={loading}/>
                {loading && (
                  <svg className="animate-spin ml-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
              {/* </button> */}
            </div>

          {/* 結果表示 */}
          {result && (
            <div className="bg-gray-800 rounded-lg overflow-hidden">
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
                        <tr className="bg-gray-700">
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
                          <tr key={index} className={`${testResult.status === 'AC' ? 'bg-green-900 bg-opacity-20' : testResult.status === 'WA' ? 'bg-red-900 bg-opacity-20' : 'bg-gray-700'} border-t border-gray-700`}>
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

          {/* ローディング表示 */}
          {loading && !result && (
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <div className="inline-block w-8 h-8 border-4 border-gray-600 border-t-purple-500 rounded-full animate-spin mb-4"></div>
              <p className="font-bold mb-4">{loadingMessage}</p>
              <div className="max-w-sm mx-auto text-left">
                <div className={`py-2 pl-6 relative ${currentStep === 'submit' ? 'text-white font-bold' : currentStep === 'init' || currentStep === 'execute' || currentStep === 'results' ? 'text-green-500' : 'text-gray-500'}`}>
                  <span className="absolute left-0">
                    {currentStep === 'submit' ? '●' : currentStep === 'init' || currentStep === 'execute' || currentStep === 'results' ? '✓' : '○'}
                  </span>
                  コード提出
                </div>
                <div className={`py-2 pl-6 relative ${currentStep === 'init' ? 'text-white font-bold' : currentStep === 'execute' || currentStep === 'results' ? 'text-green-500' : 'text-gray-500'}`}>
                  <span className="absolute left-0">
                    {currentStep === 'init' ? '●' : currentStep === 'execute' || currentStep === 'results' ? '✓' : '○'}
                  </span>
                  タスク起動中
                </div>
                <div className={`py-2 pl-6 relative ${currentStep === 'execute' ? 'text-white font-bold' : currentStep === 'results' ? 'text-green-500' : 'text-gray-500'}`}>
                  <span className="absolute left-0">
                    {currentStep === 'execute' ? '●' : currentStep === 'results' ? '✓' : '○'}
                  </span>
                  コード実行中
                </div>
                <div className={`py-2 pl-6 relative ${currentStep === 'results' ? 'text-white font-bold' : 'text-gray-500'}`}>
                  <span className="absolute left-0">
                    {currentStep === 'results' ? '●' : '○'}
                  </span>
                  結果取得中
                </div>
              </div>
            </div>
          )}
        </div>
  );
}