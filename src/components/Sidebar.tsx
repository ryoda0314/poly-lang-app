"use client";

import { useState } from 'react';
import { useAppStore } from '@/lib/store'; // インポートパスを修正
import { locales } from '@/lib/locales';
import { HomeIcon, BookOpenIcon, PencilSquareIcon, MicrophoneIcon, ClockIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

// 型 'Language' を定義またはインポート
type Language = 'English' | 'Japanese'; // 必要に応じて他の言語も追加

export const Sidebar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { learningLanguage, setLearningLanguage, _hasHydrated } = useAppStore((state: {
    learningLanguage: Language;
    setLearningLanguage: (lang: Language) => void;
    _hasHydrated: boolean;
  }) => ({
    learningLanguage: state.learningLanguage,
    setLearningLanguage: state.setLearningLanguage,
    _hasHydrated: state._hasHydrated,
  }));

  const t = locales['Japanese']; // UI言語を日本語に固定

  const menuItems = [
    { name: t.home, icon: HomeIcon, href: '/' },
    { name: t.phrasebook, icon: BookOpenIcon, href: '/phrases' },
    { name: t.phrasePractice, icon: PencilSquareIcon, href: '/practice' },
    { name: t.pronunciationPractice, icon: MicrophoneIcon, href: '#' },
    { name: t.learningHistory, icon: ClockIcon, href: '/history' },
    { name: t.settings, icon: Cog6ToothIcon, href: '/settings' },
  ];

  return (
    <>
      <aside className="fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 p-5 flex flex-col z-30">
        <div className="text-2xl font-bold text-gray-800 mb-10">Poly-Lang</div>
        {_hasHydrated ? (
          <div className="mb-6">
            <label htmlFor="lang-select" className="text-sm text-gray-500">学習言語</label>
            <select
              id="lang-select"
              value={learningLanguage}
              onChange={(e) => setLearningLanguage(e.target.value as Language)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
            >
              <option value="English">英語</option>
              <option value="Japanese">日本語</option>
              {/* 他の言語オプションをここに追加 */}
            </select>
          </div>
        ) : (
          <div className="mb-6 h-16 animate-pulse bg-gray-200 rounded-md"></div>
        )}
        <nav className="flex flex-col space-y-2">
          {_hasHydrated ? (
            menuItems.map((item) => (
              <a key={item.name} href={item.href} className="flex items-center space-x-3 p-2 rounded-md text-gray-600 hover:bg-gray-100">
                <item.icon className="h-6 w-6" />
                <span>{item.name}</span>
              </a>
            ))
          ) : (
            <div className="space-y-2 animate-pulse">
              {[...Array(6)].map((_, i) => <div key={i} className="h-10 bg-gray-200 rounded-md"></div>)}
            </div>
          )}
        </nav>
      </aside>
      <header className="md:hidden sticky top-0 bg-white/80 backdrop-blur-sm p-4 border-b border-gray-200 flex items-center z-10 shrink-0">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="text-xl font-bold ml-4">Poly-Lang</div>
      </header>
    </>
  );
};