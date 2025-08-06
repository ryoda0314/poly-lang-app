import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';

export type Language = 
  'Japanese' | 'English' | 'Korean' | 'Spanish' | 
  'German' | 'French' | 'Chinese' | 'Russian' | 
  'Portuguese' | 'Arabic' | 'Indonesian' | 'Hindi' | 
  'Thai' | 'Vietnamese' | 'Taiwanese' | 'Dutch' | 'Italian';

interface LanguageState {
  language: Language;
  fetchLanguage: () => Promise<void>;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'English', // アプリが最初に表示される際の仮の言語

  // DBから言語設定を読み込む関数
  fetchLanguage: async () => {
    const { data, error } = await supabase
      .from('user_settings')
      .select('selected_language')
      .eq('id', 1)
      .single();

    if (error) {
      console.error('言語設定の読み込みに失敗', error);
    } else if (data) {
      set({ language: data.selected_language as Language });
    }
  },

  // 言語を設定し、DBも更新する関数
  setLanguage: async (lang: Language) => {
    set({ language: lang }); // まず画面表示を更新
    const { error } = await supabase
      .from('user_settings')
      .update({ selected_language: lang })
      .eq('id', 1);

    if (error) {
      console.error('言語設定の保存に失敗', error);
    }
  },
}));