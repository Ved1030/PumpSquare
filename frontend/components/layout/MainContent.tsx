"use client";

import { cn } from "@/lib/utils";
import { usePagePathname } from "@/lib/use-page-pathname";

// Pages whose first section is a full-bleed hero render from the top of the
// viewport so the fixed header overlays it.
const OVERLAY_HERO_ROUTES = new Set(["/", "/about", "/industries", "/contact"]);

export default function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePagePathname();

  return (
    <main
      id="main-content"
      className={cn("flex-1", OVERLAY_HERO_ROUTES.has(pathname) ? "" : "pt-20")}
    >
      {children}
    </main>
  );
}
