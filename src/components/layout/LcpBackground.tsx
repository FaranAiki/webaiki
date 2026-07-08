import Image from 'next/image';

export default function LcpBackground({ desktopImage, mobileImage }: { desktopImage: string; mobileImage: string }) {
  if (!desktopImage || !mobileImage) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-screen z-[-2] pointer-events-none transform-gpu contain-strict overflow-hidden bg-theme-bg dark:bg-theme-bg-dark">
      <div className="w-full h-full absolute inset-0 blur-[4px] scale-105 opacity-80 transform-gpu" style={{ backfaceVisibility: 'hidden' }}>
        <Image
          src={`/images/background/${desktopImage}`}
          alt="Background image 1 - Muhammad Faran Aiki Portfolio"
          fill
          sizes="100vw"
          quality={50}
          priority
          className="hidden md:block object-cover"
        />
        <Image
          src={`/images/background/${mobileImage}`}
          alt="Background image 1 - Muhammad Faran Aiki Portfolio"
          fill
          sizes="100vw"
          quality={50}
          priority
          className="block md:hidden object-cover"
        />
      </div>
      <div className="absolute inset-0 transform-gpu bg-gradient-to-b from-theme-surface/90 via-theme-surface/91 to-theme-surface/93" style={{ backfaceVisibility: 'hidden' }} />
    </div>
  );
}
