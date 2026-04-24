"use client";

import { useEffect, useState } from "react";

export default function CelebrationOverlay({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      onDone();
    }, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  if (!visible) return null;

  return (
    <div
      onClick={() => { setVisible(false); onDone(); }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 cursor-pointer"
    >
      <img
        src="/celebrate.gif"
        alt="celebration"
        className="w-full h-full object-cover"
      />
      <p className="absolute bottom-10 text-white/50 text-xs">click to dismiss</p>
    </div>
  );
}
