"use client";

import dynamic from "next/dynamic";

const HomeTutorial = dynamic(() => import("./HomeTutorial"), { ssr: false });

export default function HomeTutorialWrapper() {
  return <HomeTutorial />;
}
