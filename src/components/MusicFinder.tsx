"use client";

import React, { useState } from 'react';
import { NextResponse } from 'next/server';

// Fungsi untuk mendapatkan access token dari Spotify
const getAccessToken = async () => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Spotify client ID or secret not set.");
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store' // Penting agar token selalu baru jika diperlukan
  });

  const data = await response.json();
  return data.access_token;
};

// Fungsi untuk mengambil data dari endpoint Spotify
const fetchSpotifyAPI = async (endpoint: string, token: string) => {
  const res = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) {
    const errorData = await res.json();
    console.error(`Spotify API Error for ${endpoint}:`, errorData);
    throw new Error(`Failed to fetch ${endpoint}`);
  }
  return res.json();
};

// Handler untuk GET request
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const artistId = params.id;

  if (!artistId) {
    return NextResponse.json({ error: 'Artist ID is required' }, { status: 400 });
  }

  try {
    const token = await getAccessToken();
    
    // Ambil semua data secara paralel untuk efisiensi
    const [artist, topTracks, albums] = await Promise.all([
      fetchSpotifyAPI(`artists/${artistId}`, token),
      fetchSpotifyAPI(`artists/${artistId}/top-tracks?market=US`, token),
      fetchSpotifyAPI(`artists/${artistId}/albums?include_groups=album,single&limit=50`, token)
    ]);

    return NextResponse.json({
      artist: artist,
      topTracks: topTracks.tracks,
      albums: albums.items,
    }, { status: 200 });

  } catch (error: any) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Komponen untuk ikon loading sederhana
const Spinner = () => (
  <div className="flex justify-center items-center py-10">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
  </div>
);

// Tipe data untuk sebuah playlist
interface Playlist {
  id: string;
  name: string;
  images: { url: string }[];
  owner: { display_name: string };
}

// Komponen utama halaman
export default function Spotify() {
  const [artistName, setArtistName] = useState('');
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!artistName) {
      setError("Please enter an artist name.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setPlaylists([]);
    setSelectedPlaylistId(null);

    try {
      // Panggil API Route internal kita, bukan API Spotify secara langsung
      const response = await fetch(`/api/spotify?artist=${encodeURIComponent(artistName)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch playlists.');
      }

      const data = await response.json();
      
      if (data.playlists && data.playlists.length > 0) {
        setPlaylists(data.playlists);
      } else {
        setError(`No playlists found for "${artistName}".`);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-green-400 mb-2">Spotify Playlist Finder</h1>
          <p className="text-gray-400">Find and play public playlists for any artist.</p>
        </header>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-10 flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full">
            <label htmlFor="artist" className="block text-sm font-medium text-gray-300 mb-1">Artist Name</label>
            <input
              id="artist"
              type="text"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              placeholder="e.g., Tulus, NIKI, Rich Brian"
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-md transition-colors duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed mt-2 md:mt-0 self-end md:self-center"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>

        <main>
          {error && <p className="text-center text-red-400 bg-red-900/50 p-4 rounded-md">{error}</p>}
          {isLoading && <Spinner />}

          {playlists.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  onClick={() => setSelectedPlaylistId(playlist.id)}
                  className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer group transform transition-transform duration-300 hover:scale-105 hover:bg-gray-700"
                >
                  <div className="relative aspect-square">
                    {playlist.images?.[0]?.url ? (
                      <img src={playlist.images[0].url} alt={playlist.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 6l12-3" /></svg>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300 flex items-center justify-center">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold truncate text-white">{playlist.name}</h3>
                    <p className="text-sm text-gray-400 truncate">By {playlist.owner.display_name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
        
        {selectedPlaylistId && (
          <div className="mt-12 sticky bottom-4 z-10">
             <h2 className="text-2xl font-bold mb-4 text-center">Now Playing</h2>
            <iframe
              title="Spotify Player"
              src={`https://open.spotify.com/embed/playlist/${selectedPlaylistId}`}
              width="100%"
              height="380"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="rounded-lg shadow-2xl"
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
}


