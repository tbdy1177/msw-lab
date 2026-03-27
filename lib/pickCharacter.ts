const femaleKeywords = [
  '엄마', '어머니', '여자친구', '여친', '언니', '누나', '이모', '고모',
  '할머니', '아줌마', '아내', '와이프', '딸', '여동생', '여사', '사모님',
  '선배님', '여선생', '여사님',
];

const maleKeywords = [
  '아빠', '아버지', '남자친구', '남친', '오빠', '형', '삼촌', '외삼촌',
  '할아버지', '아저씨', '남편', '아들', '남동생', '형님', '사장님',
  '팀장', '상사', '직장 상사', '선배',
];

const femaleImages = [
  '/charactor_female_01.jpg',
  '/charactor_female_02.jpg',
  '/charactor_female_03.jpg',
];

const maleImages = [
  '/charactor_male_01.jpg',
  '/charactor_male_02.jpg',
  '/charactor_male_03.jpg',
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function pickCharacter(target: string, situation: string): string {
  const text = `${target} ${situation}`.toLowerCase();

  const isFemale = femaleKeywords.some((kw) => text.includes(kw));
  const isMale = maleKeywords.some((kw) => text.includes(kw));

  if (isFemale && !isMale) return pickRandom(femaleImages);
  if (isMale && !isFemale) return pickRandom(maleImages);
  return pickRandom([...femaleImages, ...maleImages]);
}
