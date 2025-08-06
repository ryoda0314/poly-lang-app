"use client";

import { useState, useEffect, useRef } from 'react';
import { phrasebook, Phrase } from '@/data/phrases';
import { useLanguageStore } from '@/lib/store';
import { SpeakerWaveIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

const categories: Phrase['category'][] = ['基本の質問', '学習について', '経験・好み', '行動・依頼'];

export default function PhrasesPage() {
  const { language } = useLanguageStore();
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [loadingAudioId, setLoadingAudioId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true); // ★ 初期状態を読み込み中に設定
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // ★ ページ読み込み時のラグをシミュレート
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 500); // ラグをシミュレート
    return () => clearTimeout(timeout);
  }, []);

  const handlePlayAudio = async (phraseId: number, text: string) => {
    if (audioRef.current && playingId === phraseId) {
      audioRef.current.pause();
      setPlayingId(null);
      return;
    }
    
    setLoadingAudioId(phraseId);
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, lang: language }), // ★ 言語情報もAPIに渡す
      });
      
      if (!response.ok) throw new Error('音声の生成に失敗しました');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      if (audioRef.current) audioRef.current.pause();

      const newAudio = new Audio(url);
      audioRef.current = newAudio;
      
      newAudio.onplay = () => setPlayingId(phraseId);
      newAudio.onended = () => setPlayingId(null);
      newAudio.onpause = () => setPlayingId(null);
      
      newAudio.play();
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAudioId(null);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">基本フレーズ集</h1>
      {isLoading ? (
        <div className="text-center py-16 card">
          <ArrowPathIcon className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
          <h3 className="mt-2 text-lg font-medium text-gray-800">読み込み中...</h3>
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((category) => (
            <section key={category}>
              <h2 className="text-2xl font-semibold border-b pb-2 mb-4">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {phrasebook
                  .filter((phrase) => phrase.category === category)
                  .map((phrase) => {
                    const translatedText = phrase.translations[language];
                    return (
                      <div key={phrase.id} className="p-4 bg-white border rounded-lg shadow-sm flex items-center justify-between">
                        <div>
                          {/* ★ 選択された言語のフレーズを表示 */}
                          <p className="text-xl font-bold text-gray-800 mb-2">{translatedText}</p>
                          <p className="text-md text-gray-600">{phrase.japanese}</p>
                        </div>
                        <button 
                          // ★ 選択された言語のフレーズを再生
                          onClick={() => handlePlayAudio(phrase.id, translatedText)}
                          className="text-gray-400 hover:text-teal-500 transition-all p-2 rounded-full disabled:text-gray-300 flex-shrink-0"
                          disabled={loadingAudioId === phrase.id}
                        >
                          {loadingAudioId === phrase.id ? (
                            <ArrowPathIcon className="h-6 w-6 animate-spin" />
                          ) : (
                            <SpeakerWaveIcon className="h-6 w-6" />
                          )}
                        </button>
                      </div>
                    );
                  })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}