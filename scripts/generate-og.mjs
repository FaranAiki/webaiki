import { ImageResponse } from '@vercel/og';
import React from 'react';
import fs from 'fs';
import path from 'path';

const BG = 'linear-gradient(135deg, #0a0a0a 0%, #111827 55%, #0b1220 100%)';

const el = React.createElement(
  'div',
  {
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '80px 90px',
      background: BG,
      color: 'white',
      fontFamily: 'sans-serif',
    },
  },
  // Accent bar + brand
  React.createElement(
    'div',
    { style: { display: 'flex', alignItems: 'center', marginBottom: 36 } },
    React.createElement('div', { style: { width: 64, height: 8, borderRadius: 999, background: 'linear-gradient(90deg,#3b82f6,#22d3ee)' } }),
    React.createElement('div', { style: { marginLeft: 20, fontSize: 30, fontWeight: 700, letterSpacing: 2, opacity: 0.85 } }, 'FARANAIKI.ID'),
  ),
  // Name
  React.createElement(
    'div',
    { style: { fontSize: 84, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1 } },
    'Muhammad Faran Aiki',
  ),
  // Tagline
  React.createElement(
    'div',
    { style: { marginTop: 22, fontSize: 34, fontWeight: 500, opacity: 0.82 } },
    'Software Engineer · ITB Student · ONMIPA Medalist',
  ),
  // Footer line
  React.createElement(
    'div',
    { style: { marginTop: 40, fontSize: 24, opacity: 0.55 } },
    'Full-Stack Web · Flutter · Data Analysis · Mathematics',
  ),
);

async function main() {
  const res = new ImageResponse(el, { width: 1200, height: 630 });
  const buf = Buffer.from(await res.arrayBuffer());
  const out = path.join(process.cwd(), 'public', 'og-default.png');
  fs.writeFileSync(out, buf);
  console.log(`✅ Generated ${out} (${buf.length} bytes, 1200x630)`);
}

main().catch((e) => {
  console.error('❌ OG generation failed:', e);
  process.exit(1);
});
