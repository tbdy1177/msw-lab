'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useChatStore, AnalysisResult } from '@/store/chatStore';
import ScoreGauge from '@/components/ScoreGauge';
import CategoryScore from '@/components/CategoryScore';
import { generateShareImage } from '@/lib/generateShareImage';
import { getGrade } from '@/lib/getGrade';


export default function ResultPage() {
  const router = useRouter();
  const { target, situation, messages, analysis, setAnalysis, reset } = useChatStore();

  const [displayAnalysis, setDisplayAnalysis] = useState<AnalysisResult | null>(analysis);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [copyDone, setCopyDone] = useState(false);

  const loadingMessages = [
    '대화를 분석하고 있어요...',
    '조금만 기다려주세요...',
    '많이 화났죠?',
    '그동안 당신이 말싸움에 실패했던 원인...',
    '정확하게 분석해 드립니다...',
  ];
  const [msgIndex, setMsgIndex] = useState(0);
  const [msgVisible, setMsgVisible] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!messages.length) {
      router.replace('/');
      return;
    }
    if (!analysis) {
      fetchAnalysis();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isLoading && displayAnalysis) return;
    intervalRef.current = setInterval(() => {
      setMsgVisible(false);
      setTimeout(() => {
        setMsgIndex((i) => (i + 1) % loadingMessages.length);
        setMsgVisible(true);
      }, 400);
    }, 3000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, displayAnalysis]);

  const fetchAnalysis = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, situation, target }),
      });
      if (!res.ok) throw new Error();
      const data: AnalysisResult = await res.json();
      setAnalysis(data);
      setDisplayAnalysis(data);
    } catch {
      setError('잠시 문제가 생겼어요. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!displayAnalysis) return;
    setIsSaving(true);
    try {
      const dataUrl = await generateShareImage(displayAnalysis);
      // 모바일: Web Share API로 사진 앱에 바로 저장
      if (navigator.share && navigator.canShare) {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const file = new File([blob], 'msw-lab-result.png', { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: '말싸움 연구소 결과' });
          return;
        }
      }
      // 데스크탑 fallback: 링크 다운로드
      const link = document.createElement('a');
      link.download = 'msw-lab-result.png';
      link.href = dataUrl;
      link.click();
    } catch (e) {
      if ((e as Error).name !== 'AbortError') {
        alert('이미지 저장에 실패했어요. 스크린샷을 이용해주세요.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    if (!displayAnalysis) return;
    setIsSharing(true);
    try {
      const shareUrl = window.location.origin;
      const grade = getGrade(displayAnalysis.totalScore);
      const text = `말싸움 연구소에서 ${displayAnalysis.totalScore}점 (${grade}) 받았어요!\n나도 테스트해볼래?`;

      let usedShare = false;
      if (navigator.share) {
        try {
          await navigator.share({ title: '말싸움 연구소', text, url: shareUrl });
          usedShare = true;
        } catch (e) {
          if ((e as Error).name === 'AbortError') usedShare = true;
        }
      }

      if (!usedShare) {
        try {
          await navigator.clipboard.writeText(shareUrl);
          setCopyDone(true);
          setTimeout(() => setCopyDone(false), 2500);
        } catch {
          alert(`링크를 복사해주세요:\n${shareUrl}`);
        }
      }
    } finally {
      setIsSharing(false);
    }
  };

  const handleReset = () => { reset(); router.push('/'); };

  if (isLoading || !displayAnalysis) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-amber-50">
        <div className="w-full max-w-lg space-y-4 animate-pulse">
          <div className="h-6 bg-amber-100 rounded-full w-1/2 mx-auto" />
          <div className="h-48 bg-amber-100 rounded-3xl" />
          <div className="h-20 bg-amber-100 rounded-3xl" />
          <div className="h-20 bg-amber-100 rounded-3xl" />
          <div className="h-20 bg-amber-100 rounded-3xl" />
        </div>
        <p
          className="mt-6 text-base font-semibold shimmer-text transition-opacity duration-400"
          style={{ opacity: msgVisible ? 1 : 0 }}
        >
          {loadingMessages[msgIndex]}
        </p>
        {error && (
          <div className="mt-4 text-center">
            <p className="text-base text-red-400">{error}</p>
            <button onClick={fetchAnalysis} className="mt-2 text-base text-amber-500 underline">다시 시도</button>
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-amber-50 pb-20">
      <div className="max-w-lg mx-auto px-4 pt-10 space-y-6">
        <h1 className="text-3xl font-black text-center text-gray-800 tracking-tight">결과 리포트 🏆</h1>

        {/* Section A: 종합 점수 */}
        <div className="bg-white rounded-3xl shadow-sm p-6 flex flex-col items-center gap-5">
          <ScoreGauge score={displayAnalysis.totalScore} grade={displayAnalysis.grade} />
          <button
            onClick={handleDownload}
            disabled={isSaving}
            className="w-full py-3 bg-amber-50 text-amber-500 font-black text-sm rounded-2xl hover:bg-amber-100 disabled:opacity-50 active:scale-95 transition-all tracking-tight"
          >
            {isSaving ? '이미지 생성 중...' : '⬇ 결과 이미지 저장하기'}
          </button>
        </div>

        {/* Section B: 항목별 분석 */}
        <div className="space-y-3">
          <h2 className="text-lg font-black text-gray-800 tracking-tight">항목별 분석</h2>
          {displayAnalysis.categories.map((cat) => (
            <CategoryScore key={cat.name} name={cat.name} score={cat.score} description={cat.description} />
          ))}
        </div>

        {/* Section C: 피드백 */}
        <div className="bg-white rounded-3xl p-5 shadow-sm space-y-5">
          <div>
            <h2 className="text-lg font-black text-green-600 mb-3 tracking-tight">👍 잘한 점</h2>
            <ul className="space-y-2">
              {displayAnalysis.strengths.map((s, i) => (
                <li key={i} className="text-base text-gray-600 flex gap-2">
                  <span className="text-green-400 shrink-0">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-black text-amber-500 mb-3 tracking-tight">💡 개선할 점</h2>
            <ul className="space-y-4">
              {displayAnalysis.improvements.map((imp, i) => (
                <li key={i} className="text-base">
                  <p className="text-gray-700 font-medium">{imp.point}</p>
                  <p className="text-gray-400 mt-1">{imp.tip}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={handleShare}
            disabled={isSharing}
            className="flex-1 py-4 border-2 border-amber-200 text-amber-500 font-black rounded-2xl hover:bg-amber-50 active:scale-95 transition-all text-base tracking-tight disabled:opacity-50"
          >
            {isSharing ? '준비 중...' : copyDone ? '링크 복사됐어요 ✓' : '친구들에게 소문내기'}
          </button>
          <button
            onClick={handleReset}
            className="flex-1 py-4 bg-amber-400 text-white font-black rounded-2xl hover:bg-amber-500 active:scale-95 transition-all text-base tracking-tight"
          >
            다시 하기
          </button>
        </div>
      </div>
    </main>
  );
}
