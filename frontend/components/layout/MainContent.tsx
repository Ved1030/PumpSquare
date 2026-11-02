"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isIndustries = pathname === "/industries";
  const isAbout = pathname === "/about";

  return (
    <main
      id="main-content"
      className={cn("flex-1", isHome || isIndustries || isAbout ? "" : "pt-20")}
    >
      {children}
    </main>
  );
}
