import { NextRequest, NextResponse } from 'next/server';
import anthropic from '@/lib/anthropic';

export async function POST(req: NextRequest) {
  const { messages, situation, target } = await req.json();

  const conversationText = messages
    .map((m: { role: string; content: string }) =>
      `${m.role === 'user' ? '사용자' : 'AI'}: ${m.content}`
    )
    .join('\n');

  const prompt = `아래 말싸움 대화를 분석해주세요.

대상: ${target}
상황: ${situation}
대화내역:
${conversationText}

다음 JSON 형식으로만 응답하세요:
{
  "totalScore": 75,
  "grade": "말싸움 중수",
  "categories": [
    { "name": "논리력", "score": 80, "description": "..." },
    { "name": "감정 조절", "score": 70, "description": "..." },
    { "name": "표현력", "score": 75, "description": "..." },
    { "name": "설득력", "score": 65, "description": "..." }
  ],
  "strengths": ["...", "..."],
  "improvements": [
    { "point": "...", "tip": "다음에는 이렇게 해보세요: ..." },
    { "point": "...", "tip": "다음에는 이렇게 해보세요: ..." }
  ],
  "oneLineSummary": "감정은 잘 잡았지만 논리로 밀어붙이는 힘이 아쉬웠어요"
}`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });

    const text =
      response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: '분석 결과를 파싱할 수 없어요.' },
        { status: 500 }
      );
    }
    const analysis = JSON.parse(jsonMatch[0]);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: '분석 중 오류가 발생했어요.' },
      { status: 500 }
    );
  }
}
