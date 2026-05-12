import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        background: '#2563EB',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: 16,
        fontWeight: 900,
        fontFamily: 'sans-serif',
        letterSpacing: '-1px',
      }}
    >
      C
    </div>,
    { ...size }
  )
}
