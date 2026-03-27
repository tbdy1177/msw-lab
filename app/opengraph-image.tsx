import { ImageResponse } from 'next/og';

export const alt = '말싸움 연구소';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: '#FFFBEB',
          fontSize: '80px',
          color: '#F59E0B',
        }}
      >
        말싸움 연구소 ⚡
      </div>
    ),
    { ...size }
  );
}
