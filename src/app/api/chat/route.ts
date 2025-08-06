import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse, type Message } from 'ai';
import { createClient } from '@supabase/supabase-js';
import type { Language } from '@/lib/store';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import type { AiStructuredResponse } from '@/types/ai-response';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages, language }: { messages: Message[]; language: Language } = await req.json();

  // ユーザーメッセージをmessagesテーブルに保存
  await supabase.from('messages').insert({
    role: 'user',
    content: messages[messages.length - 1].content,
    language: language,
  });

  const systemMessage: ChatCompletionMessageParam = {
    role: 'system',
    content: `あなたは優秀な語学学習パートナーです。ユーザーは現在「${language}」を学習しています。あなたのタスクは、ユーザーの入力に対して応答し、学習に適した文章を抽出することです。必ず以下のJSON形式で応答してください。
    {
      "chatResponse": "ユーザーへの通常の返信です。添削や解説をここに記述します。",
      "sentenceToSave": "学習履歴に保存すべき最も重要な例文です。添削後の文か、AIが提示した例文を記述します。保存する価値がなければnullにしてください。",
      "category": "sentenceToSaveのカテゴリです。「挨拶」「質問」「依頼」などから選びます。保存しない場合はnullにしてください。"
    }`,
  };

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    stream: true,
    response_format: { type: 'json_object' },
    messages: [systemMessage, ...messages] as ChatCompletionMessageParam[],
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stream = OpenAIStream(response as any, {
    onFinal: async (completion: string) => {
      try {
        const structuredResponse: AiStructuredResponse = JSON.parse(completion);
        
        // AIの返信をmessagesテーブルに保存
        await supabase.from('messages').insert({
          role: 'assistant',
          content: structuredResponse.chatResponse,
          language: language,
        });

        // 学習履歴をlearning_historyテーブルに保存
        if (structuredResponse.sentenceToSave && structuredResponse.category) {
          await supabase.from('learning_history').insert({
            sentence: structuredResponse.sentenceToSave,
            category: structuredResponse.category,
            language: language,
          });
        }
      } catch (e) {
        console.error('JSONの解析またはDBへの保存に失敗しました:', e);
      }
    },
  });

  return new StreamingTextResponse(stream);
}