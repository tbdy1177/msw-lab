import { AnalysisResult } from '@/store/chatStore';

interface ResultCardProps {
  analysis: AnalysisResult;
}

export default function ResultCard({ analysis }: ResultCardProps) {
  return (
    <div
      id="result-card"
      style={{ width: 1080, height: 1080, fontFamily: 'sans-serif' }}
      className="flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 p-16"
    >
      <div className="text-white text-center w-full">
        <p className="text-2xl font-bold mb-2 tracking-widest opacity-70">
          말싸움 연구소
        </p>
        <div className="text-[160px] font-black leading-none my-8">
          {analysis.totalScore}
        </div>
        <div className="inline-block text-3xl font-bold mb-8 bg-white/20 px-8 py-3 rounded-full">
          {analysis.grade}
        </div>
        <p className="text-2xl opacity-90 leading-relaxed max-w-2xl mx-auto">
          {analysis.oneLineSummary}
        </p>
        <p className="mt-16 text-base opacity-40 tracking-widest">msw-lab.com</p>
      </div>
    </div>
  );
}
