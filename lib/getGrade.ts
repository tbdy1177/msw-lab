export function getGrade(score: number): string {
  if (score >= 90) return '말싸움 연구소장';
  if (score >= 80) return '수석 연구원';
  if (score >= 70) return '책임 연구원';
  if (score >= 60) return '연구원';
  if (score >= 50) return '연구 인턴';
  if (score >= 40) return '견습생';
  return '관찰 대상자';
}
