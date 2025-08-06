"use client";

import { BookOpenIcon, PencilSquareIcon, LightBulbIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/solid';

const FloatingIcons = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <BookOpenIcon className="absolute -left-4 top-1/4 h-24 w-24 text-blue-500/10 animate-spin-slow" />
    <PencilSquareIcon className="absolute -right-5 top-1/2 h-20 w-20 text-purple-500/10 animate-float" style={{ animationDelay: '2s' }} />
    <LightBulbIcon className="absolute left-1/3 top-10 h-16 w-16 text-yellow-500/10 animate-float" />
    <QuestionMarkCircleIcon className="absolute right-1/4 bottom-10 h-28 w-28 text-teal-500/10 animate-spin-slow" style={{ animationDelay: '4s' }} />
  </div>
);

export default function PronuncePage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
      <FloatingIcons />
      <div className="bg-white/60 backdrop-blur-lg p-10 rounded-3xl shadow-lg border border-gray-200/80 max-w-lg text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-800">🎙 発音チェック</h1>
        <p className="text-lg font-semibold text-gray-700">この機能はいつか実装予定です。</p>
        <p className="text-sm text-gray-500">お楽しみに！</p>
      </div>
    </div>
  );
}
