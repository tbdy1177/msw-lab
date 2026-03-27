import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const alt = '말싸움 연구소 — 뒤돌아서 후회하지 말자';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// 원본 로고 비율: 948×394
const LOGO_W = 560;
const LOGO_H = Math.round(LOGO_W * (394 / 948)); // ≈ 233px

export default async function Image() {
  const fontData = await readFile(join(process.cwd(), 'public/fonts/leeseogyun.ttf'));
  const logoData = await readFile(join(process.cwd(), 'public/logo.png'));
  const logoBase64 = `data:image/png;base64,${logoData.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#FFFBEB',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: '이서윤체',
          padding: '80px 160px',
          gap: '36px',
        }}
      >
        {/* 로고 — 명시적 width/height로 클리핑 방지 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoBase64}
          alt="말싸움 연구소"
          style={{ width: `${LOGO_W}px`, height: `${LOGO_H}px` }}
        />

        {/* 구분선 */}
        <div style={{ width: '48px', height: '3px', background: '#FDE68A', borderRadius: '2px' }} />

        {/* 설명 텍스트 */}
        <div
          style={{
            fontSize: '34px',
            color: '#92400E',
            letterSpacing: '-0.5px',
            textAlign: 'center',
          }}
        >
          AI와 함께하는 말싸움 연습 ⚡
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: '이서윤체', data: fontData, style: 'normal' }],
    }
  );
}
