import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const alt = '말싸움 연구소';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const [fontData, logoData] = await Promise.all([
    readFile(join(process.cwd(), 'public/fonts/leeseogyun.ttf')),
    readFile(join(process.cwd(), 'public/logo.png')),
  ]);

  const logoSrc = `data:image/png;base64,${Buffer.from(logoData).toString('base64')}`;

  // 카톡은 좌측부터 크롭 → 핵심 콘텐츠를 좌측 630px 안에 배치
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          background: '#FFFBEB',
          fontFamily: 'msw',
          padding: '0 80px',
        }}
      >
        {/* 좌측: 로고 + 텍스트 (좌측 630px 안에 들어오도록) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '28px',
            maxWidth: '560px',
          }}
        >
          <img src={logoSrc} width={460} height={191} />
          <div
            style={{
              display: 'flex',
              width: '40px',
              height: '3px',
              background: '#FDE68A',
              borderRadius: '2px',
            }}
          />
          <div style={{ display: 'flex', fontSize: '30px', color: '#92400E' }}>
            AI와 함께하는 말싸움 연습 ⚡
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'msw', data: fontData, style: 'normal' }],
    }
  );
}
