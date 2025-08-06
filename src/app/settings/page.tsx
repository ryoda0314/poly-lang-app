"use client";

import { useState } from 'react';
import { BellIcon, LanguageIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('ja');

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">設定</h1>
      <div className="space-y-6 max-w-2xl">
        
        {/* UI言語設定 */}
        <div className="card p-6">
          <div className="flex items-center">
            <LanguageIcon className="h-6 w-6 mr-3 text-gray-500" />
            <h3 className="text-lg font-semibold">UI言語</h3>
          </div>
          <p className="text-gray-500 text-sm mt-1 mb-3">アプリ全体の表示言語を選択します。</p>
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          >
            <option value="ja">日本語</option>
            <option value="en">English</option>
          </select>
        </div>

        {/* 通知設定 */}
        <div className="card p-6">
          <div className="flex items-center">
            <BellIcon className="h-6 w-6 mr-3 text-gray-500" />
            <h3 className="text-lg font-semibold">通知設定</h3>
          </div>
          <p className="text-gray-500 text-sm mt-1 mb-3">学習リマインダーなどの通知を受け取ります。</p>
          <div className="flex items-center justify-between">
            <span>プッシュ通知を有効にする</span>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                notifications ? 'bg-teal-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  notifications ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 音声設定 */}
        <div className="card p-6">
           <div className="flex items-center">
            <SpeakerWaveIcon className="h-6 w-6 mr-3 text-gray-500" />
            <h3 className="text-lg font-semibold">音声設定</h3>
          </div>
          <p className="text-gray-500 text-sm mt-1 mb-3">音声の再生速度や種類を調整します。</p>
          <div>
            <label htmlFor="voice-speed" className="block text-sm font-medium text-gray-700">再生速度</label>
            <input 
              id="voice-speed"
              type="range" 
              min="0.5" 
              max="1.5" 
              step="0.25" 
              defaultValue="1"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

      </div>
    </div>
  );
}