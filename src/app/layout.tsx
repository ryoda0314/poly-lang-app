"use client";

import { useState, useEffect } from 'react';
import { useLanguageStore, Language } from '@/lib/store';
import { HomeIcon, PencilSquareIcon, BookOpenIcon, ClockIcon, Cog6ToothIcon, MicrophoneIcon } from '@heroicons/react/24/outline';
import './globals.css';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language, setLanguage, fetchLanguage } = useLanguageStore();

 // アプリ起動時に一度だけDBから言語設定を読み込む
  useEffect(() => {
    fetchLanguage();
  }, [fetchLanguage]);

   const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: 'ホーム', icon: HomeIcon, href: '/' },
    { name: '基本フレーズ集', icon: BookOpenIcon, href: '/phrases' },
    { name: 'フレーズ作成練習', icon: PencilSquareIcon, href: '/practice' },
    { name: '発音練習', icon: MicrophoneIcon, href: '/pronunciation' },
    { name: '学習履歴', icon: ClockIcon, href: '/history' },
    { name: '設定', icon: Cog6ToothIcon, href: '/settings' },
  ];

  return (
    <html lang="ja">
      <head>
        <title>Poly-Lang App</title>
        <meta name="description" content="A new language learning experience" />
      </head>
      <body className="bg-gray-50 text-gray-800">
        {isMenuOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" onClick={() => setIsMenuOpen(false)}></div>}

        <aside
          className={`
            fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 p-5 z-30
            transition-transform duration-300 ease-in-out transform
            ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0
          `}
        >
          <div className="text-2xl font-bold text-gray-800 mb-10">Poly-Lang</div>
          <nav className="flex flex-col space-y-2">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="group flex items-center space-x-3 p-2 rounded-md text-gray-600 hover:bg-gradient-to-r hover:from-teal-400 hover:to-blue-500 hover:text-white transition-all duration-300 transform hover:scale-105"
              >
                <item.icon className="h-6 w-6 transition-transform transform group-hover:scale-125 group-hover:text-yellow-300" />
                <span className="transition-transform duration-300 group-hover:translate-x-1">{item.name}</span>
              </a>
            ))}
          </nav>
        </aside>

        <div className="md:pl-64">
          <header className="md:hidden sticky top-0 bg-white/80 backdrop-blur-sm p-4 border-b border-gray-200 flex items-center z-10">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 transition-transform transform hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="text-xl font-bold ml-4">Poly-Lang</div>
          </header>

          <main className="p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}