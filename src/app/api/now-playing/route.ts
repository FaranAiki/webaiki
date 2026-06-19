import { NextResponse } from 'next/server';
import querystring from 'querystring';

// gacor juga bisa kek gini
const {
  SPOTIFY_CLIENT_ID: client_id,
  SPOTIFY_CLIENT_SECRET: client_secret,
  SPOTIFY_REFRESH_TOKEN: refresh_token,
} = process.env;

// Encode client_id and client_secret for the Authorization header
const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

// This function gets an access token from Spotify using the refresh token.
// The token is cached for 55 minutes (Spotify tokens expire in 60 min) at the server edge.
const getAccessToken = async () => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token,
    }),
    next: { revalidate: 3300 }, // 55 minutes: re-use the same token across requests
  });

  return response.json();
};

// Add a short cache header so the edge/CDN can serve this without hammering Spotify
export const revalidate = 30;

// The main GET handler for our API route
export async function GET() {
  const { access_token } = await getAccessToken();

  if (!access_token) {
    return NextResponse.json({ isPlaying: false, error: 'Could not retrieve access token.' }, { status: 500 });
  }

  const response = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    next: { revalidate: 30 }, // Cache at the Next.js fetch level for 30 seconds
  });

  // If nothing is playing, Spotify returns a 204 No Content status
  if (response.status === 204 || response.status > 400) {
    return NextResponse.json({ isPlaying: false });
  }

  const song = await response.json();

  // If the track or item is null, it means the user is likely listening to a podcast or something not in the track format.
  if (song.item === null) {
      return NextResponse.json({ isPlaying: false });
  }

  // Extract the data we want to send to the client
  const data = {
    isPlaying: song.is_playing,
    title: song.item.name,
    artist: song.item.artists.map((_artist: { name: string }) => _artist.name).join(', '),
    album: song.item.album.name,
    albumImageUrl: song.item.album.images[0]?.url,
    songUrl: song.item.external_urls.spotify,
  };

  return NextResponse.json(data);
}
