"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const HomeTutorial = dynamic(() => import("./HomeTutorial"), { ssr: false });

export default function HomeTutorialWrapper() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShouldLoad(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!shouldLoad) return null;
  return <HomeTutorial />;
}
