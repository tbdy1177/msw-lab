'use client';

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatBubble({ role, content }: ChatBubbleProps) {
  const isUser = role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-sm mr-2 shrink-0 mt-1 shadow-sm">
          🤖
        </div>
      )}
      <div
        className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap font-medium ${
          isUser
            ? 'bg-amber-400 text-white rounded-br-sm shadow-sm'
            : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border-2 border-amber-100'
        }`}
      >
        {content}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex justify-start mb-3 items-end">
      <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-sm mr-2 shrink-0 shadow-sm">
        🤖
      </div>
      <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm border-2 border-amber-100">
        <div className="flex gap-1 items-center h-4">
          <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}
