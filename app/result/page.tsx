'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useChatStore, AnalysisResult } from '@/store/chatStore';
import ScoreGauge from '@/components/ScoreGauge';
import CategoryScore from '@/components/CategoryScore';
import ResultCard from '@/components/ResultCard';

export default function ResultPage() {
  const router = useRouter();
  const { target, situation, messages, analysis, setAnalysis, reset } = useChatStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
    } catch {
      setError('잠시 문제가 생겼어요. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!analysis) return;
    setIsSaving(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const el = document.getElementById('result-card');
      if (!el) throw new Error();
      const canvas = await html2canvas(el, { scale: 1, useCORS: true });
      const link = document.createElement('a');
      link.download = 'msw-lab-result.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      alert('이미지 저장에 실패했어요. 스크린샷을 이용해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    reset();
    router.push('/');
  };

  if (isLoading || !analysis) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-50">
        <div className="w-full max-w-md space-y-4 animate-pulse">
          <div className="h-6 bg-gray-200 rounded-full w-1/2 mx-auto" />
          <div className="h-48 bg-gray-200 rounded-2xl" />
          <div className="h-20 bg-gray-200 rounded-2xl" />
          <div className="h-20 bg-gray-200 rounded-2xl" />
          <div className="h-20 bg-gray-200 rounded-2xl" />
        </div>
        <p className="mt-6 text-sm text-gray-400">대화를 분석하고 있어요...</p>
        {error && (
          <div className="mt-4 text-center">
            <p className="text-sm text-red-400">{error}</p>
            <button
              onClick={fetchAnalysis}
              className="mt-2 text-sm text-indigo-500 underline"
            >
              다시 시도
            </button>
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto px-4 pt-10 space-y-6">
        <h1 className="text-2xl font-black text-center text-gray-800">결과 리포트</h1>

        {/* Section A: 종합 점수 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center">
          <ScoreGauge score={analysis.totalScore} grade={analysis.grade} />
        </div>

        {/* Section B: 항목별 분석 */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-gray-700">항목별 분석</h2>
          {analysis.categories.map((cat) => (
            <CategoryScore
              key={cat.name}
              name={cat.name}
              score={cat.score}
              description={cat.description}
            />
          ))}
        </div>

        {/* Section C: 피드백 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-5">
          <div>
            <h2 className="text-base font-bold text-green-600 mb-3">👍 잘한 점</h2>
            <ul className="space-y-2">
              {analysis.strengths.map((s, i) => (
                <li key={i} className="text-sm text-gray-600 flex gap-2">
                  <span className="text-green-400 shrink-0">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-base font-bold text-amber-500 mb-3">💡 개선할 점</h2>
            <ul className="space-y-4">
              {analysis.improvements.map((imp, i) => (
                <li key={i} className="text-sm">
                  <p className="text-gray-700 font-medium">{imp.point}</p>
                  <p className="text-gray-400 mt-1">{imp.tip}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Section D: 공유 이미지 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3">
          <h2 className="text-base font-bold text-gray-700">공유하기</h2>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="w-full py-3 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition"
          >
            {showPreview ? '미리보기 숨기기' : '공유 카드 미리보기'}
          </button>
          {showPreview && (
            <div
              className="overflow-hidden rounded-xl mx-auto"
              style={{
                width: 324,
                height: 324,
                transform: 'none',
              }}
            >
              <div style={{ transform: 'scale(0.3)', transformOrigin: 'top left', width: 1080, height: 1080 }}>
                <ResultCard analysis={analysis} />
              </div>
            </div>
          )}
          <button
            onClick={handleDownload}
            disabled={isSaving}
            className="w-full py-3 bg-indigo-500 text-white font-bold rounded-xl disabled:opacity-60 hover:bg-indigo-600 active:scale-95 transition-all text-sm"
          >
            {isSaving ? '저장 중...' : '이미지 저장하기'}
          </button>
        </div>

        {/* 다시 하기 */}
        <button
          onClick={handleReset}
          className="w-full py-4 border-2 border-indigo-200 text-indigo-500 font-bold rounded-xl hover:bg-indigo-50 active:scale-95 transition-all"
        >
          다시 하기
        </button>
      </div>

      {/* html2canvas용 숨겨진 카드 */}
      <div className="fixed" style={{ left: -9999, top: -9999 }}>
        <ResultCard analysis={analysis} />
      </div>
    </main>
  );
}
