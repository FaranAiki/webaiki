import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Dynamic values
    const title = searchParams.has('title')
      ? searchParams.get('title')?.slice(0, 100)
      : 'Faran Aiki - Software Engineer';
      
    const description = searchParams.has('desc')
      ? searchParams.get('desc')?.slice(0, 150)
      : 'Portfolio of Muhammad Faran Aiki';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0a0a0a',
            backgroundImage: 'linear-gradient(to bottom right, #0a0a0a, #171717)',
            padding: '40px 80px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              padding: '60px 80px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            }}
          >
            <div
              style={{
                fontSize: 64,
                fontFamily: 'Inter',
                fontWeight: 900,
                letterSpacing: '-0.05em',
                color: 'white',
                marginBottom: 20,
                textAlign: 'center',
              }}
            >
              {title}
            </div>
            
            <div
              style={{
                fontSize: 32,
                fontFamily: 'Inter',
                fontWeight: 400,
                color: '#a3a3a3',
                textAlign: 'center',
                maxWidth: '80%',
              }}
            >
              {description}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: 60,
                borderTop: '1px solid rgba(255,255,255,0.1)',
                paddingTop: 40,
                width: '100%',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 600,
                  color: '#3b82f6', // theme-500
                  letterSpacing: '0.05em',
                }}
              >
                faranaiki.id
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    const err = e as Error;
    console.log(`${err.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
