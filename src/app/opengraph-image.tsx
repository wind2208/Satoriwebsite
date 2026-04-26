import { ImageResponse } from 'next/og';

export const alt = 'SatoriAI Lab — 把 AI 算力,變成現實生產力';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '88px 96px',
          background:
            'radial-gradient(circle at 50% 0%, rgba(61,123,204,0.28), transparent 60%), #0A0E1A',
          color: '#FFFFFF',
          fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 999,
              background: 'linear-gradient(135deg, #3D7BCC, #1E3A6F)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              fontWeight: 600,
            }}
          >
            S
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 500,
              letterSpacing: '-0.01em',
            }}
          >
            SatoriAI Lab
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            style={{
              fontSize: 22,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#6B8AB5',
            }}
          >
            SATORI · AI · LAB
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              fontSize: 88,
              lineHeight: 1.05,
              fontWeight: 500,
              letterSpacing: '-0.02em',
              maxWidth: 980,
            }}
          >
            <span>把 AI 算力,變成「</span>
            <span style={{ color: '#3D7BCC' }}>現實生產力</span>
            <span>」</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#A8B5C7',
            fontSize: 22,
          }}
        >
          <span>satoriai.lab</span>
          <span>@LL830813 · @satoriai_lab</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
