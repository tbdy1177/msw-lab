import { AnalysisResult } from '@/store/chatStore';
import { getGrade } from '@/lib/getGrade';

const SIZE = 1080;
const FONT = '이서윤체';
const BG = '#FFFBEB';
const AMBER_400 = '#F59E0B';
const AMBER_700 = '#B45309';
const AMBER_100 = '#FEF3C7';
const AMBER_200 = '#FDE68A';

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawBubblyBorder(
  ctx: CanvasRenderingContext2D,
  margin: number,
  size: number,
  color: string,
  lineWidth: number
) {
  const x = margin, y = margin;
  const w = size - 2 * margin;
  const h = size - 2 * margin;

  const targetR = 22;
  const hBumps = Math.round(w / (2 * targetR));
  const vBumps = Math.round(h / (2 * targetR));
  const hR = w / (2 * hBumps);
  const vR = h / (2 * vBumps);

  ctx.beginPath();
  // TOP: left→right, bumps outward (upward)
  for (let i = 0; i < hBumps; i++) {
    ctx.arc(x + (2 * i + 1) * hR, y, hR, Math.PI, 0, false);
  }
  // RIGHT: top→bottom, bumps outward (rightward)
  for (let i = 0; i < vBumps; i++) {
    ctx.arc(x + w, y + (2 * i + 1) * vR, vR, -Math.PI / 2, Math.PI / 2, false);
  }
  // BOTTOM: right→left, bumps outward (downward)
  for (let i = hBumps - 1; i >= 0; i--) {
    ctx.arc(x + (2 * i + 1) * hR, y + h, hR, 0, Math.PI, false);
  }
  // LEFT: bottom→top, bumps outward (leftward)
  for (let i = vBumps - 1; i >= 0; i--) {
    ctx.arc(x, y + (2 * i + 1) * vR, vR, Math.PI / 2, 3 * Math.PI / 2, false);
  }
  ctx.closePath();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function getLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const ch of text) {
    const test = line + ch;
    if (ctx.measureText(test).width > maxWidth && line !== '') {
      lines.push(line);
      line = ch;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function generateShareImage(analysis: AnalysisResult): Promise<string> {
  const font = new FontFace(FONT, 'url(/fonts/leeseogyun.ttf)');
  await font.load();
  document.fonts.add(font);

  const logo = await loadImage('/logo.png');

  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d')!;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  // ── 배경 ──────────────────────────────────────────
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // ── 하단 로고 (말풍선 그래픽 제거: 상단 35% 크롭) ────
  const logoW = 186;
  const cropTop = Math.round(logo.naturalHeight * 0.35);
  const cropH = logo.naturalHeight - cropTop;
  const logoH = Math.round(logoW * cropH / logo.naturalWidth);
  const logoPadBottom = 60;
  const logoY = SIZE - logoH - logoPadBottom;
  ctx.drawImage(
    logo,
    0, cropTop, logo.naturalWidth, cropH,
    (SIZE - logoW) / 2, logoY, logoW, logoH
  );

  // ── 레이아웃 계산 ──────────────────────────────────
  const SCORE_SIZE = 336;
  const GRADE_SIZE = 52;
  const GRADE_PAD_X = 48;
  const GRADE_PAD_Y = 16;
  const GRADE_H = GRADE_SIZE + GRADE_PAD_Y * 2;
  const SUMMARY_SIZE = 46;
  const SUMMARY_LINE_H = 68;
  const MAX_TEXT_W = 860;
  const SCORE_TO_PILL_GAP = 6;
  const PILL_TO_DIVIDER_GAP = 60;
  const DIVIDER_TO_SUMMARY_GAP = 78;

  // 요약 텍스트 줄 분리 (디바이더 너비 계산용)
  ctx.font = `${SUMMARY_SIZE}px ${FONT}`;
  const summaryLines = getLines(ctx, analysis.oneLineSummary, MAX_TEXT_W);
  const summaryHeight = summaryLines.length * SUMMARY_LINE_H;

  const scoreAscent = SCORE_SIZE * 0.8;
  const scoreDescent = SCORE_SIZE * 0.22;

  const contentH =
    scoreAscent + scoreDescent +
    SCORE_TO_PILL_GAP + GRADE_H +
    PILL_TO_DIVIDER_GAP + 3 +
    DIVIDER_TO_SUMMARY_GAP + summaryHeight;

  const availableH = logoY;
  const startY = Math.max((availableH - contentH) / 2 + 40, 60);

  // ── 점수 숫자 ──────────────────────────────────────
  const scoreY = startY + scoreAscent;
  ctx.fillStyle = AMBER_400;
  ctx.font = `${SCORE_SIZE}px ${FONT}`;
  ctx.fillText(String(analysis.totalScore), SIZE / 2, scoreY);

  // ── 등급 pill ──────────────────────────────────────
  const grade = getGrade(analysis.totalScore);
  ctx.font = `${GRADE_SIZE}px ${FONT}`;
  const gradeTextW = ctx.measureText(grade).width;
  const pillW = gradeTextW + GRADE_PAD_X * 2;
  const pillX = SIZE / 2 - pillW / 2;
  const pillTop = scoreY + scoreDescent + SCORE_TO_PILL_GAP;

  drawRoundRect(ctx, pillX, pillTop, pillW, GRADE_H, GRADE_H / 2);
  ctx.fillStyle = AMBER_100;
  ctx.fill();
  ctx.fillStyle = AMBER_700;
  ctx.font = `${GRADE_SIZE}px ${FONT}`;
  ctx.fillText(grade, SIZE / 2, pillTop + GRADE_PAD_Y + GRADE_SIZE * 0.85);

  // ── 디바이더 (요약 텍스트 최대 줄 너비에 맞춤) ────────
  ctx.font = `${SUMMARY_SIZE}px ${FONT}`;
  const maxLineW = Math.max(...summaryLines.map((l) => ctx.measureText(l).width));
  const dividerY = pillTop + GRADE_H + PILL_TO_DIVIDER_GAP;
  ctx.strokeStyle = AMBER_200;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(SIZE / 2 - maxLineW / 2, dividerY);
  ctx.lineTo(SIZE / 2 + maxLineW / 2, dividerY);
  ctx.stroke();

  // ── 한줄 요약 ──────────────────────────────────────
  ctx.fillStyle = AMBER_400;
  ctx.font = `${SUMMARY_SIZE}px ${FONT}`;
  const summaryStartY = dividerY + DIVIDER_TO_SUMMARY_GAP;
  summaryLines.forEach((line, i) => {
    ctx.fillText(line, SIZE / 2, summaryStartY + i * SUMMARY_LINE_H);
  });

  return canvas.toDataURL('image/png');
}
