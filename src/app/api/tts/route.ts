import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = '21m00Tcm4TlvDq8ikWAM'; // 声の種類 (例: Rachel)

    if (!apiKey) {
      return NextResponse.json({ error: 'Eleven Labs APIキーが設定されていません。' }, { status: 500 });
    }
    if (!text) {
      return NextResponse.json({ error: 'テキストがありません。' }, { status: 400 });
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `APIからのエラー: ${errorText}` }, { status: response.status });
    }

    // 音声データをそのままクライアントにストリーミング
    return new NextResponse(response.body, {
      headers: { 'Content-Type': 'audio/mpeg' },
    });

  } catch (error) {
    console.error('音声合成エラー:', error);
    return NextResponse.json({ error: '音声合成中にエラーが発生しました。' }, { status: 500 });
  }
}