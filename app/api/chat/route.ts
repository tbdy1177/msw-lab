import { NextRequest } from 'next/server';
import anthropic from '@/lib/anthropic';

export async function POST(req: NextRequest) {
  const { messages, situation, target } = await req.json();

  const systemPrompt = `당신은 말싸움 연습 상대입니다.
대상: ${target}
상황: ${situation}

규칙:
- 해당 대상의 입장에서 현실감 있게 반응하세요
- 너무 쉽게 지지 말고, 적당히 반박하고 억울함을 표현하세요
- 욕설·혐오표현은 사용하지 마세요
- 대화가 자연스럽게 마무리되는 시점(5~10턴 이후 흐름이 정리될 때)에
  "이 정도면 충분히 연습한 것 같아요. 결과를 볼까요?" 라고 제안하세요
- 한국어로 답하세요
- 답변은 2~4문장으로 짧고 현실적으로`;

  const mapped = messages.map((m: { role: string; content: string }) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }));

  const apiMessages =
    mapped.length === 0 || mapped[0].role === 'assistant'
      ? [{ role: 'user' as const, content: '대화를 시작해주세요.' }, ...mapped]
      : mapped;

  try {
    const stream = anthropic.messages.stream({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      system: systemPrompt,
      messages: apiMessages,
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              controller.enqueue(new TextEncoder().encode(chunk.delta.text));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readableStream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (err) {
    console.error('Chat API error:', err);
    return new Response('AI 서버가 혼잡해요. 잠시 후 다시 시도해주세요.', { status: 503 });
  }
}
