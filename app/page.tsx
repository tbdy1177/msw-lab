'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useChatStore } from '@/store/chatStore';

export default function Home() {
  const router = useRouter();
  const { setTarget, setSituation, reset } = useChatStore();
  const [targetInput, setTargetInput] = useState('');
  const [situationInput, setSituationInput] = useState('');

  const isValid = targetInput.trim().length > 0 && situationInput.trim().length > 0;

  const handleStart = () => {
    if (!isValid) return;
    reset();
    setTarget(targetInput.trim());
    setSituation(situationInput.trim());
    router.push('/chat');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-indigo-600 tracking-tight">
            말싸움 연구소
          </h1>
          <p className="mt-2 text-gray-400 text-sm">
            AI와 함께 말하는 힘을 키우세요 — 뒤돌아서 후회하지 말자
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              말싸움 상대
            </label>
            <input
              type="text"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              placeholder="예: 직장 상사, 남자친구, 친구"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              상황 설명
            </label>
            <textarea
              value={situationInput}
              onChange={(e) => setSituationInput(e.target.value)}
              placeholder="어떤 상황인지 설명해주세요. 예: 친구가 약속을 또 어겼는데 자기 잘못이 아니라고 우김"
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition resize-none"
            />
          </div>
          {!isValid && (targetInput || situationInput) && (
            <p className="text-xs text-red-400">상대와 상황을 모두 입력해주세요.</p>
          )}
          <button
            onClick={handleStart}
            disabled={!isValid}
            className="w-full py-4 bg-indigo-500 text-white font-bold rounded-xl text-base disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-600 active:scale-95 transition-all"
          >
            말싸움 시작하기 ⚡
          </button>
        </div>
      </div>
    </main>
  );
}
