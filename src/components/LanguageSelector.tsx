"use client";

import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid';
import { Fragment } from 'react';
import { useLanguageStore, type Language } from '@/lib/store';

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'English', name: '英語', flag: '🇺🇸' },
  { code: 'Korean', name: '韓国語', flag: '🇰🇷' },
  { code: 'Spanish', name: 'スペイン語', flag: '🇪🇸' },
  { code: 'German', name: 'ドイツ語', flag: '🇩🇪' },
  { code: 'French', name: 'フランス語', flag: '🇫🇷' },
  { code: 'Chinese', name: '中国語', flag: '🇨🇳' },
  { code: 'Russian', name: 'ロシア語', flag: '🇷🇺' },
  { code: 'Portuguese', name: 'ポルトガル語', flag: '🇵🇹' },
    { code: 'Arabic', name: 'アラビア語', flag: '🇸🇦' },
    { code: 'Indonesian', name: 'インドネシア語', flag: '🇮🇩' },
    { code: 'Hindi', name: 'ヒンディー語', flag: '🇮🇳' },
    { code: 'Thai', name: 'タイ語', flag: '🇹🇭' },
    { code: 'Vietnamese', name: 'ベトナム語', flag: '🇻🇳' },
    { code: 'Taiwanese', name: '台湾語', flag: '🇹🇼' },
    { code: 'Dutch', name: 'オランダ語', flag: '🇳🇱' },
    { code: 'Italian', name: 'イタリア語', flag: '🇮🇹' },
    { code: 'Japanese', name: '日本語', flag: '🇯🇵' },
];

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguageStore();
  const selectedLanguage = languages.find(l => l.code === language);

  return (
    <Listbox value={language} onChange={setLanguage}>
      <div className="relative">
        <Listbox.Button
          className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
          aria-label="学習言語を選択"
        >
          <span className="block truncate">
            {selectedLanguage?.flag || '🌐'} {selectedLanguage?.name || '言語未選択'}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10">
            {languages.map((lang) => (
              <Listbox.Option
                key={lang.code}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-teal-100 text-teal-900' : 'text-gray-900'
                  }`
                }
                value={lang.code}
              >
                {({ selected }: { selected: boolean }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                      {lang.flag} {lang.name}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-teal-600">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};