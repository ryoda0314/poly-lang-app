import type { Language } from './store';

// 翻訳テキストの型を定義
type Translations = {
  home: string;
  phrasebook: string;
  phrasePractice: string;
  pronunciationPractice: string;
  learningHistory: string;
  settings: string;
  learningLanguageLabel: string;
};

// 各言語の辞書
export const locales: Record<Language, Translations> = {
  Japanese: {
    home: 'ホーム',
    phrasebook: '基本フレーズ集',
    phrasePractice: 'フレーズ作成練習',
    pronunciationPractice: '発音練習',
    learningHistory: '学習履歴',
    settings: '設定',
    learningLanguageLabel: '学習言語',
  },
  English: {
    home: 'Home',
    phrasebook: 'Phrasebook',
    phrasePractice: 'Phrase Practice',
    pronunciationPractice: 'Pronunciation Practice',
    learningHistory: 'Learning History',
    settings: 'Settings',
    learningLanguageLabel: 'Learning Language',
  },
  Korean: {
    home: '홈',
    phrasebook: '구문집',
    phrasePractice: '구문 연습',
    pronunciationPractice: '발음 연습',
    learningHistory: '학습 기록',
    settings: '설정',
    learningLanguageLabel: '학습 언어',
  },
  Spanish: {
    home: 'Inicio',
    phrasebook: 'Libro de frases',
    phrasePractice: 'Práctica de frases',
    pronunciationPractice: 'Práctica de pronunciación',
    learningHistory: 'Historial de aprendizaje',
    settings: 'Configuración',
    learningLanguageLabel: 'Idioma de aprendizaje',
  },
  German: {
    home: 'Startseite',
    phrasebook: 'Sprachführer',
    phrasePractice: 'Satzübung',
    pronunciationPractice: 'Ausspracheübung',
    learningHistory: 'Lernverlauf',
    settings: 'Einstellungen',
    learningLanguageLabel: 'Lernsprache',
  },
  French: {
    home: 'Accueil',
    phrasebook: 'Guide de conversation',
    phrasePractice: 'Pratique des phrases',
    pronunciationPractice: 'Pratique de la prononciation',
    learningHistory: 'Historique d\'apprentissage',
    settings: 'Paramètres',
    learningLanguageLabel: 'Langue d\'apprentissage',
  },
  Chinese: {
    home: '首页',
    phrasebook: '常用语手册',
    phrasePractice: '句子练习',
    pronunciationPractice: '发音练习',
    learningHistory: '学习记录',
    settings: '设置',
    learningLanguageLabel: '学习语言',
  },
  Russian: {
    home: 'Главная',
    phrasebook: 'Разговорник',
    phrasePractice: 'Практика фраз',
    pronunciationPractice: 'Практика произношения',
    learningHistory: 'История обучения',
    settings: 'Настройки',
    learningLanguageLabel: 'Язык обучения',
  },
  Portuguese: {
    home: 'Início',
    phrasebook: 'Livro de frases',
    phrasePractice: 'Prática de frases',
    pronunciationPractice: 'Prática de pronúncia',
    learningHistory: 'Histórico de aprendizado',
    settings: 'Configurações',
    learningLanguageLabel: 'Idioma de aprendizagem',
  },
  Arabic: {
    home: 'الرئيسية',
    phrasebook: 'كتاب العبارات',
    phrasePractice: 'تمرين الجمل',
    pronunciationPractice: 'تمرين النطق',
    learningHistory: 'سجل التعلم',
    settings: 'الإعدادات',
    learningLanguageLabel: 'لغة التعلم',
  },
  Indonesian: {
    home: 'Beranda',
    phrasebook: 'Buku frasa',
    phrasePractice: 'Latihan frasa',
    pronunciationPractice: 'Latihan pengucapan',
    learningHistory: 'Riwayat belajar',
    settings: 'Pengaturan',
    learningLanguageLabel: 'Bahasa belajar',
  },
  Hindi: {
    home: 'होम',
    phrasebook: 'वाक्यांश-पुस्तिका',
    phrasePractice: 'वाक्यांश अभ्यास',
    pronunciationPractice: 'उच्चारण अभ्यास',
    learningHistory: 'सीखने का इतिहास',
    settings: 'सेटिंग्स',
    learningLanguageLabel: 'सीखने की भाषा',
  },
  Thai: {
    home: 'หน้าแรก',
    phrasebook: 'หนังสือวลี',
    phrasePractice: 'ฝึกฝนวลี',
    pronunciationPractice: 'ฝึกการออกเสียง',
    learningHistory: 'ประวัติการเรียนรู้',
    settings: 'การตั้งค่า',
    learningLanguageLabel: 'ภาษาที่เรียน',
  },
  Vietnamese: {
    home: 'Trang chủ',
    phrasebook: 'Sổ tay cụm từ',
    phrasePractice: 'Luyện tập cụm từ',
    pronunciationPractice: 'Luyện phát âm',
    learningHistory: 'Lịch sử học tập',
    settings: 'Cài đặt',
    learningLanguageLabel: 'Ngôn ngữ học',
  },
  Taiwanese: {
    home: '首頁',
    phrasebook: '常用語手冊',
    phrasePractice: '句子練習',
    pronunciationPractice: '發音練習',
    learningHistory: '學習記錄',
    settings: '設定',
    learningLanguageLabel: '學習語言',
  },
  Dutch: {
    home: 'Home',
    phrasebook: 'Zinnenboek',
    phrasePractice: 'Zinnen oefenen',
    pronunciationPractice: 'Uitspraak oefenen',
    learningHistory: 'Leergeschiedenis',
    settings: 'Instellingen',
    learningLanguageLabel: 'Leertaal',
  },
  Italian: {
    home: 'Home',
    phrasebook: 'Frasario',
    phrasePractice: 'Esercizio di frasi',
    pronunciationPractice: 'Esercizio di pronuncia',
    learningHistory: 'Cronologia di apprendimento',
    settings: 'Impostazioni',
    learningLanguageLabel: 'Lingua di studio',
  },
};