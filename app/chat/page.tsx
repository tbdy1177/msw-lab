'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useChatStore, Message } from '@/store/chatStore';
import ChatBubble, { TypingIndicator } from '@/components/ChatBubble';

export default function ChatPage() {
  const router = useRouter();
  const { target, situation, messages, addMessage } = useChatStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [showSituation, setShowSituation] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showAIEndModal, setShowAIEndModal] = useState(false);
  const [toast, setToast] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!target || !situation) {
      router.replace('/');
    }
  }, [target, situation, router]);

  useEffect(() => {
    if (!target || !situation || hasInitialized.current || messages.length > 0) return;
    hasInitialized.current = true;
    sendToAI([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, situation]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const sendToAI = async (msgs: Message[]) => {
    setIsLoading(true);
    setStreamingContent('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: msgs, situation, target }),
      });

      if (!response.ok) throw new Error('API 오류');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('스트림 오류');

      const decoder = new TextDecoder();
      let full = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value);
        setStreamingContent(full);
      }

      addMessage({ role: 'assistant', content: full, timestamp: new Date() });
      setStreamingContent('');

      if (full.includes('결과를 볼까요?')) {
        setShowAIEndModal(true);
      }
    } catch {
      showToast('잠시 문제가 생겼어요. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };
    addMessage(userMessage);
    setInput('');
    await sendToAI([...messages, userMessage]);
  };

  const handleEnd = () => {
    if (messages.length < 2) {
      showToast('대화가 너무 짧아요. 조금 더 이야기해보세요!');
      return;
    }
    setShowEndModal(true);
  };

  if (!target || !situation) return null;

  return (
    <div className="min-h-screen bg-amber-50 flex justify-center">
    <div className="flex flex-col h-screen w-full max-w-lg">
      {/* Header */}
      <div className="bg-white border-b-2 border-amber-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => router.push('/')}
          className="text-amber-400 hover:text-amber-500 transition text-xl font-black"
        >
          ←
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-gray-800 truncate tracking-tight">{target}와의 말싸움 ⚡</p>
          <button
            onClick={() => setShowSituation(!showSituation)}
            className="text-xs text-amber-500 font-semibold hover:underline"
          >
            {showSituation ? '상황 접기' : '상황 보기'}
          </button>
        </div>
        <button
          onClick={handleEnd}
          className="text-xs text-white font-bold bg-red-400 hover:bg-red-500 px-3 py-1.5 rounded-xl transition shrink-0"
        >
          여기서 끝내기
        </button>
      </div>

      {/* Situation toggle */}
      {showSituation && (
        <div className="bg-amber-100 px-4 py-3 text-sm text-amber-800 font-medium border-b-2 border-amber-200">
          {situation}
        </div>
      )}

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.map((msg, i) => (
          <ChatBubble key={i} role={msg.role} content={msg.content} />
        ))}
        {isLoading && streamingContent === '' && <TypingIndicator />}
        {streamingContent && (
          <ChatBubble role="assistant" content={streamingContent} />
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t-2 border-amber-100 px-4 py-3 flex gap-2 sticky bottom-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="하고 싶은 말을 입력하세요..."
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 border-2 border-amber-100 rounded-2xl text-sm font-medium focus:outline-none focus:border-amber-400 disabled:bg-amber-50 transition bg-amber-50 placeholder:text-gray-300"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="px-4 py-2.5 bg-amber-400 text-white rounded-2xl text-sm font-black disabled:opacity-40 hover:bg-amber-500 active:scale-95 transition-all shadow-sm"
        >
          전송
        </button>
      </div>

      {/* End modal */}
      {showEndModal && (
        <Modal
          title="여기서 끝낼까요?"
          description="지금까지의 대화로 결과를 분석할게요"
          onConfirm={() => router.push('/result')}
          onCancel={() => setShowEndModal(false)}
        />
      )}

      {/* AI end suggestion modal */}
      {showAIEndModal && (
        <Modal
          title="결과를 확인할까요?"
          description="AI가 대화 마무리를 제안했어요"
          onConfirm={() => router.push('/result')}
          onCancel={() => setShowAIEndModal(false)}
          cancelLabel="계속하기"
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-lg z-50 whitespace-nowrap">
          {toast}
        </div>
      )}
    </div>
    </div>
  );
}

function Modal({
  title,
  description,
  onConfirm,
  onCancel,
  cancelLabel = '취소',
}: {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  cancelLabel?: string;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-6">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl border-2 border-amber-100">
        <h3 className="text-lg font-black text-gray-800 mb-2 tracking-tight">{title}</h3>
        <p className="text-sm text-gray-500 font-medium mb-6">{description}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 border-2 border-amber-200 text-amber-600 font-bold rounded-2xl hover:bg-amber-50 transition text-sm"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-amber-400 text-white font-black rounded-2xl hover:bg-amber-500 transition text-sm"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
