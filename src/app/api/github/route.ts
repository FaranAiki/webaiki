import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://api.github.com/users/FaranAiki', {
      headers: {
        'User-Agent': 'FaranAiki-Portfolio'
      },
      // Cache the response for 1 hour (3600 seconds) to heavily reduce API calls
      // and prevent getting rate-limited by GitHub
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch GitHub data' }, { status: res.status });
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (_error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
