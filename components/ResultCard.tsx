import { AnalysisResult } from '@/store/chatStore';
import { getGrade } from '@/lib/getGrade';
import Image from 'next/image';

interface ResultCardProps {
  analysis: AnalysisResult;
}

export default function ResultCard({ analysis }: ResultCardProps) {
  const grade = getGrade(analysis.totalScore);

  return (
    <div
      id="result-card"
      style={{
        width: 1080,
        height: 1080,
        fontFamily: '이서윤체, sans-serif',
        backgroundColor: '#FFFBEB',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 100px',
        boxSizing: 'border-box',
      }}
    >
      {/* 로고 */}
      <Image
        src="/logo.png"
        alt="말싸움 연구소"
        width={620}
        height={258}
        style={{ width: 620, height: 'auto', marginBottom: 40 }}
      />

      {/* 점수 + 등급 블록 */}
      <div style={{ textAlign: 'center', lineHeight: 1 }}>
        <div style={{ fontSize: 200, color: '#F59E0B', lineHeight: 1, marginBottom: 16 }}>
          {analysis.totalScore}
        </div>
        <div
          style={{
            display: 'inline-block',
            fontSize: 52,
            color: '#B45309',
            backgroundColor: '#FEF3C7',
            borderRadius: 999,
            padding: '14px 48px',
          }}
        >
          {grade}
        </div>
      </div>

      {/* 구분선 */}
      <div
        style={{
          width: 760,
          height: 3,
          backgroundColor: '#FDE68A',
          margin: '56px auto',
        }}
      />

      {/* 한줄 요약 */}
      <p
        style={{
          fontSize: 46,
          color: '#6B7280',
          textAlign: 'center',
          lineHeight: 1.5,
          maxWidth: 860,
        }}
      >
        {analysis.oneLineSummary}
      </p>

      {/* URL */}
      <p style={{ fontSize: 34, color: '#D1D5DB', marginTop: 56 }}>
        msw-lab.com
      </p>
    </div>
  );
}
