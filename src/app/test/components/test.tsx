'use client';

import React, { useState, useEffect } from 'react';
import AWS from "aws-sdk";

interface AWSConfProps {
    bucket: string;
    region: string;
    accessKey: string;
    secretAccessKey: string;
}

export default function CodePage({bucket, region, accessKey, secretAccessKey}: AWSConfProps) {
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

  // 問題説明を取得する関数
  const getProblemDescription = () => {
    switch (problemId) {
      case '100':
        return `<h4>Two Sum</h4><p>Given an array of integers and a target, return indices of two numbers that add up to the target.</p>`;
      case '101':
        return `<h4>Fibonacci Sequence</h4><p>Generate the nth Fibonacci number.</p>`;
      case '102':
        return `<h4>Binary Search</h4><p>Implement binary search in a sorted array.</p>`;
      default:
        return '';
    }
  };

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
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto p-4 flex flex-col md:flex-row gap-4">
        {/* 左側: エディタとコントロール */}
        <div className="w-full md:w-3/5 flex flex-col">
          <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <div className="flex items-center mb-4">
              <div className="flex-1">
                <select
                  value={problemId}
                  onChange={(e) => setProblemId(e.target.value)}
                  className="bg-gray-700 text-white px-3 py-2 rounded"
                >
                  <option value="100">1: Two Sum</option>
                  <option value="101">2: Fibonacci Sequence</option>
                  <option value="102">3: Binary Search</option>
                </select>
              </div>
              <div className="flex-1 text-right">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-gray-700 text-white px-3 py-2 rounded"
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
              className="w-full h-96 bg-gray-900 text-gray-100 font-mono text-sm p-4 rounded resize-none mb-4"
              placeholder="Write your solution here..."
            ></textarea>
            <div className="flex justify-end">
              <button
                onClick={submitCode}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded flex items-center"
              >
                <span>提出する</span>
                {loading && (
                  <svg className="animate-spin ml-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
              </button>
            </div>
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

        {/* 右側: 問題と制約 */}
        <div className="w-full md:w-2/5">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-4">問題文</h2>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Two Sum</h3>
              <p className="mb-4">整数の配列 nums と整数 target が与えられたとき、その合計が target になる2つの数のインデックスを返します。</p>
              <p className="mb-4">各入力に対して常に一つの解が存在すると仮定し、同じ要素を2回使用することはできません。</p>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-700 text-white mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </span>
                <span className="text-sm">実行時間: 2秒</span>
              </div>
              <div className="flex items-center">
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-700 text-white mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM6.553 5.106a1 1 0 10-.893 1.789l.894-.447a1 1 0 00-.001-1.342zM12.446 5.106a1 1 0 01.894 1.789l-.894-.447a1 1 0 010-1.342zM6.447 13.894a1 1 0 01-.894-1.789l.894.447a1 1 0 010 1.342zM3 9a1 1 0 112 0 1 1 0 01-2 0zm7 0a1 1 0 100 2 1 1 0 000-2zm7 0a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" />
                  </svg>
                </span>
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
                <div className="bg-gray-900 p-3 rounded">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-400">入力例1</span>
                    <button className="text-xs text-gray-400 hover:text-white">
                      コピー
                    </button>
                  </div>
                  <pre className="text-sm">2 7 11 15
9</pre>
                </div>
              </div>
              
              <div className="bg-gray-900 p-3 rounded">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-400">出力例1</span>
                  <button className="text-xs text-gray-400 hover:text-white">
                    コピー
                  </button>
                </div>
                <pre className="text-sm">0 1</pre>
              </div>
              
              <div className="bg-gray-900 p-3 rounded">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-400">入力例2</span>
                  <button className="text-xs text-gray-400 hover:text-white">
                    コピー
                  </button>
                </div>
                <pre className="text-sm">3 2 4
6</pre>
              </div>
              
              <div className="bg-gray-900 p-3 rounded">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-400">出力例2</span>
                  <button className="text-xs text-gray-400 hover:text-white">
                    コピー
                  </button>
                </div>
                <pre className="text-sm">1 2</pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* フッター */}
      <div className="bg-gray-800 p-4 text-center text-gray-400 mt-6">
        <div className="flex justify-center space-x-6">
          <a href="#" className="flex items-center text-sm hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
            グローバルリーダーボード
          </a>
        </div>
      </div>
    </div>
  );
}