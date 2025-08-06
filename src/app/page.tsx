"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useLanguageStore } from '@/lib/store';
import { LanguageSelector } from '@/components/LanguageSelector';
import { 
  UserCircleIcon, BookOpenIcon, CalendarDaysIcon, 
  ChatBubbleLeftRightIcon, PencilSquareIcon, SparklesIcon,
  ArrowRightIcon, LightBulbIcon, QuestionMarkCircleIcon
} from '@heroicons/react/24/solid';

const FloatingIcons = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <BookOpenIcon className="absolute -left-4 top-1/4 h-24 w-24 text-blue-500/10 animate-spin-slow" />
    <PencilSquareIcon className="absolute -right-5 top-1/2 h-20 w-20 text-purple-500/10 animate-float" style={{ animationDelay: '2s' }} />
    <LightBulbIcon className="absolute left-1/3 top-10 h-16 w-16 text-yellow-500/10 animate-float" />
    <QuestionMarkCircleIcon className="absolute right-1/4 bottom-10 h-28 w-28 text-teal-500/10 animate-spin-slow" style={{ animationDelay: '4s' }} />
  </div>
);

export default function HomePage() {
  const [userStats, setUserStats] = useState({
    name: '読み込み中...',
    level: 1,
    exp: 0,
    learningDays: 0,
    vocabCount: 0,
    avgWords: 0,
    todayQuest: '新しい単語を3つ使って、自己紹介をしてみよう！'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      setIsLoading(true);
      try {
        const [
          settingsRes,
          vocabCountRes,
          learningDaysRes,
          avgWordsRes
        ] = await Promise.all([
          supabase.from('user_settings').select('name').eq('id', 1).single(),
          supabase.from('learning_history').select('*', { count: 'exact', head: true }),
          supabase.rpc('get_learning_days'),
          supabase.rpc('get_average_words')
        ]);

        const name = settingsRes.data?.name || '冒険者';
        const vocabCount = vocabCountRes.count || 0;
        const learningDays = learningDaysRes.data || 0;
        const avgWords = avgWordsRes.data || 0;
        const level = 1 + Math.floor(vocabCount / 10);
        const exp = (vocabCount % 10) * 10;

        setUserStats(prev => ({
          ...prev,
          name,
          level,
          exp,
          learningDays,
          vocabCount,
          avgWords: parseFloat(avgWords.toFixed(1)),
        }));
      } catch (error) {
        console.error("ユーザーデータの取得に失敗しました:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserStats();
  }, []);

  return (
    <div className="relative"> 
      <FloatingIcons />
      <div className={`animate-fadeIn space-y-8 ${isLoading ? 'opacity-50 blur-sm' : ''}`}>
        <h1 className="text-4xl font-bold text-gray-800">
          こんにちは、<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">{userStats.name}</span>！
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-gray-200/80">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-1 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500">
                <UserCircleIcon className="h-16 w-16 text-white bg-black/20 rounded-full p-1" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Player</p>
                <h2 className="text-2xl font-bold text-gray-900">{userStats.name}</h2>
              </div>
            </div>
            <div className="mb-6">
              <div className="flex justify-between items-end mb-1">
                <p className="text-sm font-bold text-blue-700">Lv. {userStats.level}</p>
                <p className="text-xs text-gray-600">Next EXP</p>
              </div>
              <div className="w-full bg-white/50 rounded-full h-3 border border-gray-200/50">
                <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${userStats.exp}%` }}></div>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">学習言語</label>
              <LanguageSelector />
            </div>
            <div className="space-y-4 pt-4 border-t border-gray-200/80">
              <div className="flex justify-between items-center text-md">
                <span className="flex items-center gap-2 text-gray-700"><CalendarDaysIcon className="h-5 w-5" />学習日数</span>
                <span className="font-bold ml-auto">{userStats.learningDays} 日</span>
              </div>
              <div className="flex justify-between items-center text-md">
                <span className="flex items-center gap-2 text-gray-700"><BookOpenIcon className="h-5 w-5" />習得語彙数</span>
                <span className="font-bold ml-auto">{userStats.vocabCount} 語</span>
              </div>
              <div className="flex justify-between items-center text-md">
                <span className="flex items-center gap-2 text-gray-700"><ChatBubbleLeftRightIcon className="h-5 w-5" />平均語数</span>
                <span className="font-bold ml-auto">{userStats.avgWords} 語</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-gray-200/80">
              <div className="flex items-center gap-3 mb-3">
                <SparklesIcon className="h-7 w-7 text-yellow-500" />
                <h3 className="text-xl font-bold text-gray-900">今日のクエスト</h3>
              </div>
              <p className="text-gray-700 text-lg">{userStats.todayQuest}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Link 
                  href="/practice" 
                  className="group relative block overflow-hidden rounded-2xl p-6 text-white shadow-xl bg-gradient-to-r from-blue-500 to-indigo-600 bg-[length:200%_auto] bg-[position:0%_center] transition-all duration-500 ease-in-out hover:shadow-2xl group-hover:bg-[position:100%_center] active:scale-95"
               >
                  <PencilSquareIcon className="h-10 w-10 mb-3 opacity-80 transition-transform duration-300 group-hover:-translate-y-1" />
                  <h4 className="text-xl font-semibold">フレーズ作成練習</h4>
                  <p className="text-sm opacity-90 mt-1">AIと対話して新しい表現を学ぶ</p>
                  <ArrowRightIcon className="h-6 w-6 absolute right-6 top-6 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1" />
               </Link>
               <Link 
                  href="/history" 
                  className="group relative block overflow-hidden rounded-2xl p-6 text-white shadow-xl bg-gradient-to-r from-purple-500 to-pink-600 bg-[length:200%_auto] bg-[position:0%_center] transition-all duration-500 ease-in-out hover:shadow-2xl group-hover:bg-[position:100%_center] active:scale-95"
               >
                  <BookOpenIcon className="h-10 w-10 mb-3 opacity-80 transition-transform duration-300 group-hover:-translate-y-1" />
                  <h4 className="text-xl font-semibold">学習履歴</h4>
                  <p className="text-sm opacity-90 mt-1">習得したフレーズを確認する</p>
                  <ArrowRightIcon className="h-6 w-6 absolute right-6 top-6 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1" />
               </Link>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}