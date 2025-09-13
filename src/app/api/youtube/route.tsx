import { NextResponse } from 'next/server';

// I don't know what this is. I just copy pasted from Gemini
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const playlistId = searchParams.get('playlistId');
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!playlistId) {
    return NextResponse.json({ error: 'Playlist ID is required' }, { status: 400 });
  }
  if (!apiKey) {
    return NextResponse.json({ error: 'YouTube API key is not configured' }, { status: 500 });
  }
  
  try {
    // 1. Ambil detail playlist untuk mendapatkan judul dan nama channel
    const playlistDetailsUrl = `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${apiKey}`;
    const playlistRes = await fetch(playlistDetailsUrl);
    const playlistData = await playlistRes.json();
    
    if (!playlistData.items || playlistData.items.length === 0) {
      return NextResponse.json({ error: 'Playlist not found' }, { status: 404 });
    }

    const playlistTitle = playlistData.items[0].snippet.title;
    const channelTitle = playlistData.items[0].snippet.channelTitle;

    // 2. Ambil semua video dari playlist (menangani pagination)
    let allVideos: any[] = [];
    let nextPageToken = '';
    
    do {
      const playlistItemsUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&pageToken=${nextPageToken}&key=${apiKey}`;
      const itemsRes = await fetch(playlistItemsUrl);
      const itemsData = await itemsRes.json();
      
      allVideos = allVideos.concat(itemsData.items);
      nextPageToken = itemsData.nextPageToken;

    } while (nextPageToken);

    const videos = allVideos
      .filter(item => item.snippet?.thumbnails?.medium?.url) // Filter video yang mungkin privat/dihapus
      .map(item => ({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        channel: item.snippet.videoOwnerChannelTitle || channelTitle,
      }));

    return NextResponse.json({
      title: playlistTitle,
      channel: channelTitle,
      videos: videos,
    }, { status: 200 });

  } catch (error: any) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

