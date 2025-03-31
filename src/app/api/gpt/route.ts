import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.API_KEY;

export async function POST(req: NextRequest) {
  const { messages, problem, lang } = await req.json();

  if (!messages || !problem || !lang) {
    return NextResponse.json({ error: 'Messages, problem, and lang are required' }, { status: 400 });
  }

  if (!API_KEY) {
    return NextResponse.json({ error: 'API key is missing' }, { status: 500 });
  }

  const formattedMessages = [
    { role: 'system', content: 'あなたは優秀なプログラマーです。' },
    { role: 'user', content: `問題：${problem}\n解答：${messages}\n言語：${lang}` },
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: formattedMessages,
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  console.log(data);
  return NextResponse.json(data);
}