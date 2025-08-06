export interface AiStructuredResponse {
  chatResponse: string;       // ユーザーへの返信メッセージ
  sentenceToSave: string | null; // 学習履歴に保存する文章 (なければnull)
  category: string | null;      // 保存する文章のカテゴリ (なければnull)
}