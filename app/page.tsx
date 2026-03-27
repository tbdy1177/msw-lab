'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useChatStore } from '@/store/chatStore';
import Image from 'next/image';

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
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-amber-50">
      <div className="w-full max-w-lg">
        <div className="flex flex-col items-center mb-10">
          <Image
            src="/logo.png"
            alt="말싸움 연구소"
            width={948}
            height={394}
            priority
            className="w-52 sm:w-64 h-auto"
          />
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-base font-black text-gray-800 mb-2 tracking-tight">
              말싸움 상대
            </label>
            <input
              type="text"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              placeholder="예: 직장 상사, 남자친구, 친구"
              className="w-full px-4 py-3 border-2 border-amber-100 rounded-2xl text-base font-medium focus:outline-none focus:border-amber-400 transition bg-amber-50 placeholder:text-black/30"
            />
          </div>
          <div>
            <label className="block text-base font-black text-gray-800 mb-2 tracking-tight">
              상황 설명
            </label>
            <textarea
              value={situationInput}
              onChange={(e) => setSituationInput(e.target.value)}
              placeholder="어떤 상황인지 설명해주세요. 예: 친구가 약속을 또 어겼는데 자기 잘못이 아니라고 우김"
              rows={4}
              className="w-full px-4 py-3 border-2 border-amber-100 rounded-2xl text-base font-medium focus:outline-none focus:border-amber-400 transition bg-amber-50 placeholder:text-black/30 resize-none"
            />
          </div>
          {!isValid && (targetInput || situationInput) && (
            <p className="text-sm text-red-400 font-medium">상대와 상황을 모두 입력해주세요.</p>
          )}
          <button
            onClick={handleStart}
            disabled={!isValid}
            className="w-full py-4 bg-amber-400 text-white font-black rounded-2xl text-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-500 active:scale-95 transition-all tracking-tight shadow-sm"
          >
            말싸움 시작하기 ⚡
          </button>
        </div>
      </div>
    </main>
  );
}
