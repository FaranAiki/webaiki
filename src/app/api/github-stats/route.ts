import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type');
  const theme = searchParams.get('theme') || 'default';
  const username = searchParams.get('username') || 'FaranAiki';
  
  let targetUrl = '';
  
  if (type === 'profile') {
    targetUrl = `https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=${theme}&hide_border=true&bg_color=00000000`;
  } else if (type === 'langs') {
    targetUrl = `https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=${theme}&hide_border=true&bg_color=00000000`;
  } else if (type === 'activity') {
    targetUrl = `https://github-readme-activity-graph.vercel.app/graph?username=${username}&theme=${theme}&hide_border=true&bg_color=00000000&line=theme-500`;
  } else {
    return new NextResponse('Invalid type parameter', { status: 400 });
  }

  try {
    const res = await fetch(targetUrl, {
      next: { revalidate: 86400 } // Cache at Next.js level for 1 day
    });

    if (!res.ok) {
      return new NextResponse('Failed to fetch from upstream', { status: res.status });
    }

    const svg = await res.text();
    
    const headers = new Headers();
    headers.set('Content-Type', 'image/svg+xml');
    // Instruct browser and CDNs to cache this for 1 day (86400 seconds)
    // This fixes the Lighthouse Cache TTL warning
    headers.set('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400');
    
    return new NextResponse(svg, {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Error proxying github stats:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
