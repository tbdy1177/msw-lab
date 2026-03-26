'use client';

interface CategoryScoreProps {
  name: string;
  score: number;
  description: string;
}

export default function CategoryScore({ name, score, description }: CategoryScoreProps) {
  const getBarColor = (s: number) => {
    if (s >= 80) return 'bg-amber-400';
    if (s >= 60) return 'bg-amber-300';
    if (s >= 40) return 'bg-orange-300';
    return 'bg-red-400';
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border-2 border-amber-100">
      <div className="flex justify-between items-center mb-2">
        <span className="font-black text-gray-800 text-sm tracking-tight">{name}</span>
        <span className="text-base font-black text-amber-500">{score}</span>
      </div>
      <div className="w-full bg-amber-50 rounded-full h-2.5 mb-2">
        <div
          className={`h-2.5 rounded-full ${getBarColor(score)} transition-all duration-700`}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 leading-relaxed font-medium">{description}</p>
    </div>
  );
}
