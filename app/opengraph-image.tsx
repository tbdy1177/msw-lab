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

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: '#FFFBEB',
          fontFamily: 'msw',
          padding: '0 160px',
          gap: '32px',
        }}
      >
        {/* 로고 */}
        <img src={logoSrc} width={560} height={233} />

        {/* 구분선 */}
        <div style={{ display: 'flex', width: '48px', height: '3px', background: '#FDE68A', borderRadius: '2px' }} />

        {/* 설명 */}
        <div style={{ display: 'flex', fontSize: '34px', color: '#92400E' }}>
          AI와 함께하는 말싸움 연습 ⚡
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'msw', data: fontData, style: 'normal' }],
    }
  );
}
