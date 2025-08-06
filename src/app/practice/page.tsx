"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { useChat, type Message } from 'ai/react';
import { supabase } from '@/lib/supabaseClient';
import { useLanguageStore, type Language } from '@/lib/store';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { PaperAirplaneIcon, UserCircleIcon, ArrowPathIcon, SparklesIcon } from '@heroicons/react/24/solid';

// 受け取った文字列をJSONパースしてchatResponseを抜き出す関数
function extractChatResponse(content: string): string {
  try {
    const obj = JSON.parse(content);
    if (obj.chatResponse) return obj.chatResponse;
    return content; // chatResponseがなければそのまま返す
  } catch {
    return content; // JSONでなければそのまま返す
  }
}

export default function PracticePage() {
  const { language } = useLanguageStore();
  const [historyIsLoading, setHistoryIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading: isAiLoading, setMessages } = useChat({
    api: '/api/chat',
    body: { language },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchHistory = useCallback(async (lang: Language) => {
    setHistoryIsLoading(true);
    setError(null);
    try {
      const { data, error: dbError } = await supabase.from('messages').select('*').eq('language', lang).order('created_at', { ascending: true });
      if (dbError) throw dbError;
      setMessages(data || []);
    } catch (err) {
      console.error('履歴の取得に失敗しました', err);
      setError('チャット履歴の読み込みに失敗しました。');
      setMessages([]);
    } finally {
      setHistoryIsLoading(false);
    }
  }, [setMessages]);

  useEffect(() => {
    if (language) fetchHistory(language);
  }, [language, fetchHistory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="relative h-[calc(100vh-80px)] -m-4 sm:-m-6 lg:-m-8 bg-white">
      <div className="overflow-y-auto h-full">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-32">
          {historyIsLoading ? (
            <div className="text-center text-gray-500 animate-pulse">読み込み中...</div>
          ) : error ? (
            <div className="text-center p-8">
              <p className="text-red-500">{error}</p>
              <button onClick={() => fetchHistory(language)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">再試行</button>
            </div>
          ) : (
            <>
              {messages.length === 0 && !isAiLoading ? (
                <div className="text-center animate-fadeIn pt-16">
                  <div className="inline-block p-3 rounded-full bg-gradient-to-r from-blue-400 to-emerald-400 mb-4">
                    <SparklesIcon className="h-8 w-8 text-white" />
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">こんにちは！</h1>
                  <p className="mt-2 text-gray-500">何を学びますか？</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {messages.map((m) => (
                    <div key={m.id} className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === 'user' ? 'bg-gray-300' : ''}`}>
                        {m.role === 'user' ? ( <UserCircleIcon className="h-6 w-6 text-gray-600"/> ) : ( <SparklesIcon className="h-5 w-5 text-blue-500"/> )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 mb-2">{m.role === 'user' ? 'あなた' : 'AIアシスタント'}</p>
                        <div className="prose prose-lg max-w-none text-gray-700">
                          <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
                            {extractChatResponse(m.content)}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isAiLoading && (
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"><SparklesIcon className="h-5 w-5 text-blue-500"/></div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 mb-2">AIアシスタント</p>
                        <div className="prose prose-lg max-w-none text-gray-700 animate-pulse">考え中...</div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white to-transparent">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 pt-8">
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <input
                value={input}
                onChange={handleInputChange}
                placeholder="ここに文章を入力、または質問してください"
                className="w-full rounded-full border-gray-300 bg-white p-4 pl-6 pr-16 text-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-blue-500 p-3 text-white transition-transform hover:scale-110 disabled:bg-gray-300 disabled:hover:scale-100"
                disabled={isAiLoading || !input.trim()}
              >
                <PaperAirplaneIcon className="h-6 w-6" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}