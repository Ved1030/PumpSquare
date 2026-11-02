"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-40 grid size-12 place-items-center rounded-full border border-line bg-white text-primary shadow-lg shadow-primary/10 transition-all duration-300 hover:border-accent hover:bg-accent hover:text-white"
    >
      <ArrowUp aria-hidden="true" className="size-5" />
    </button>
  );
}
