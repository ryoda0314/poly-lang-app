"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useLanguageStore, type Language } from '@/lib/store';
import { SpeakerWaveIcon, ArrowPathIcon, BookOpenIcon, TagIcon, CalendarIcon } from '@heroicons/react/24/solid';

interface HistoryItem {
  id: string;
  created_at: string;
  sentence: string;
  category: string | null;
}

const categoryIcons: Record<string, React.ElementType> = {
  '挨拶': TagIcon,
  '質問': TagIcon,
  '依頼': TagIcon,
  '感情表現': TagIcon,
  '一般': TagIcon,
};

export default function HistoryPage() {
  const { language } = useLanguageStore();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [playingId, setPlayingId] = useState<string | null>(null);
  const [loadingAudioId, setLoadingAudioId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayAudio = async (itemId: string, text: string) => {
    if (audioRef.current && playingId === itemId) {
      audioRef.current.pause();
      setPlayingId(null);
      return;
    }
    setLoadingAudioId(itemId);
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, lang: language }),
      });
      if (!response.ok) throw new Error('音声の生成に失敗しました');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      if (audioRef.current) audioRef.current.pause();
      const newAudio = new Audio(url);
      audioRef.current = newAudio;
      newAudio.onplay = () => setPlayingId(itemId);
      newAudio.onended = () => setPlayingId(null);
      newAudio.onpause = () => setPlayingId(null);
      newAudio.play();
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAudioId(null);
    }
  };

  const fetchHistory = useCallback(async (lang: Language) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: dbError } = await supabase
        .from('learning_history')
        .select('id, created_at, sentence, category')
        .eq('language', lang)
        .order('created_at', { ascending: false });
      if (dbError) throw dbError;
      setHistory(data || []);
    } catch (err) {
      console.error('[History Page] 学習履歴の取得に失敗しました:', err);
      setError('データの読み込みに失敗しました。');
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (language) fetchHistory(language);
  }, [language, fetchHistory]);

  const groupedHistory = useMemo(() => {
    return history.reduce((acc, item) => {
      const category = item.category || '一般';
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {} as Record<string, HistoryItem[]>);
  }, [history]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">学習履歴</h1>
          <p className="text-gray-500 mt-1">保存したフレーズのタイムライン</p>
        </div>
        <button onClick={() => fetchHistory(language)} disabled={isLoading} className="p-2 text-gray-400 rounded-full hover:bg-gray-200 disabled:text-gray-300">
          <ArrowPathIcon className={`h-6 w-6 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-16 card">
          <ArrowPathIcon className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
          <h3 className="mt-2 text-lg font-medium text-gray-800">読み込み中...</h3>
        </div>
      ) : error ? (
        <div className="text-center p-8 card bg-red-50 border-red-200">
          <p className="text-red-600 font-semibold">{error}</p>
          <button onClick={() => fetchHistory(language)} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">再試行</button>
        </div>
      ) : (
        <div className="space-y-12">
          {history.length > 0 ? (
            Object.entries(groupedHistory).map(([category, items]) => {
              const Icon = categoryIcons[category] || TagIcon;
              return (
                <section key={category}>
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="h-6 w-6 text-gray-400" />
                    <h2 className="text-2xl font-semibold capitalize">{category}</h2>
                  </div>
                  <div className="relative pl-6 border-l-2 border-gray-200 space-y-8">
                    {items.map((item) => (
                      <div key={item.id} className="relative">
                        <div className="absolute -left-[33px] top-1 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <CalendarIcon className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="card card-hover p-4 ml-6">
                          <p className="text-lg text-gray-800 mb-2">{item.sentence}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-400">{new Date(item.created_at).toLocaleDateString('ja-JP')}</p>
                            <button onClick={() => handlePlayAudio(item.id, item.sentence)} className="text-gray-400 hover:text-teal-500 transition-all p-2 rounded-full disabled:text-gray-300 flex-shrink-0" disabled={loadingAudioId === item.id}>
                              {loadingAudioId === item.id ? ( <ArrowPathIcon className="h-5 w-5 animate-spin" /> ) : ( <SpeakerWaveIcon className="h-5 w-5" /> )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )
            })
          ) : (
            <div className="text-center py-16 card">
              <BookOpenIcon className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-lg font-medium text-gray-800">履歴はありません</h3>
              <p className="mt-1 text-sm text-gray-500">この言語で保存された学習履歴はまだありません。</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}