'use client';

import { getGrade } from '@/lib/getGrade';

interface ScoreGaugeProps {
  score: number;
  grade: string;
}

export default function ScoreGauge({ score }: ScoreGaugeProps) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return '#F4A827';
    if (s >= 60) return '#FBBF24';
    if (s >= 40) return '#FB923C';
    return '#EF4444';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width="180" height="180" className="-rotate-90">
          <circle cx="90" cy="90" r={radius} fill="none" stroke="#FEF3C7" strokeWidth="14" />
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke={getColor(score)}
            strokeWidth="14"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-black text-gray-800">{score}</span>
          <span className="text-sm text-gray-400 font-semibold">/ 100</span>
        </div>
      </div>
      <span className="mt-3 text-xl font-black text-amber-500 tracking-tight">{getGrade(score)}</span>
    </div>
  );
}
