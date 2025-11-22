import 'react';

declare module 'react' {
  interface IframeHTMLAttributes<T> extends HTMLAttributes<T> {
    // Biar bisa si Spotify dan SoundCloud
    credentialless?: boolean | string;
  }
}
