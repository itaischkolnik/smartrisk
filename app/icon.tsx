import { ImageResponse } from 'next/server';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundColor: '#2563eb', // Blue color
          borderRadius: 4,
        }}
      />
    ),
    {
      ...size,
    }
  );
} 