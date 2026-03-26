'use client';

interface CategoryScoreProps {
  name: string;
  score: number;
  description: string;
}

export default function CategoryScore({ name, score, description }: CategoryScoreProps) {
  const getBarColor = (s: number) => {
    if (s >= 80) return 'bg-indigo-500';
    if (s >= 60) return 'bg-violet-500';
    if (s >= 40) return 'bg-amber-400';
    return 'bg-red-400';
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-gray-700 text-sm">{name}</span>
        <span className="text-base font-bold text-indigo-600">{score}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
        <div
          className={`h-2 rounded-full ${getBarColor(score)} transition-all duration-700`}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}
