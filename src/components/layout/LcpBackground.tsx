import { getImageProps } from 'next/image';

export default function LcpBackground({ desktopImage, mobileImage }: { desktopImage: string; mobileImage: string }) {
  if (!desktopImage || !mobileImage) return null;

  const commonProps = {
    alt: `Background image 1 - Muhammad Faran Aiki Portfolio`,
    fill: true,
    sizes: "100vw",
    quality: 50,
    priority: true,
    loading: "eager" as const,
    fetchPriority: "high" as const,
  };

  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...commonProps, src: `/images/background/${desktopImage}` });

  const {
    props: { srcSet: mobileSrcSet, src: mobileSrc, alt, loading, fetchPriority, sizes },
  } = getImageProps({ ...commonProps, src: `/images/background/${mobileImage}` });

  return (
    <div className="fixed top-0 left-0 w-full h-screen z-[-2] pointer-events-none transform-gpu contain-strict overflow-hidden bg-theme-bg dark:bg-theme-bg-dark">
      <div className="w-full h-full absolute inset-0 blur-[4px] scale-105 opacity-80 transform-gpu" style={{ backfaceVisibility: 'hidden' }}>
        <picture>
          <source media="(min-width: 768px)" srcSet={desktopSrcSet} />
          <source media="(max-width: 767px)" srcSet={mobileSrcSet} />
          <img
            src={mobileSrc}
            alt={alt}
            loading={loading}
            fetchPriority={fetchPriority}
            sizes={sizes}
            className="w-full h-full object-cover"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </picture>
      </div>
      <div className="absolute inset-0 transform-gpu bg-gradient-to-b from-theme-surface/90 via-theme-surface/91 to-theme-surface/93" style={{ backfaceVisibility: 'hidden' }} />
    </div>
  );
}
