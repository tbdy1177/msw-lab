import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const alt = '말싸움 연구소 — 뒤돌아서 후회하지 말자';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

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
          gap: '32px',
        }}
      >
        {/* 로고 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoBase64} alt="말싸움 연구소" style={{ width: '520px', height: 'auto' }} />

        {/* 설명 텍스트 */}
        <div
          style={{
            fontSize: '36px',
            color: '#92400E',
            letterSpacing: '-0.5px',
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
