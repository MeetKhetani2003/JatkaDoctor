"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      try {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "instant",
        });
        document.documentElement.scrollTo({
          top: 0,
          left: 0,
          behavior: "instant",
        });
      } catch (e) {
        window.scrollTo(0, 0);
      }
    };

    // Run immediately to start, then on next animation frame and a short timeout
    // to override any Next.js router scroll restoration or asynchronous rendering height changes
    handleScroll();
    const frameId = requestAnimationFrame(handleScroll);
    const timeoutId = setTimeout(handleScroll, 50);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timeoutId);
    };
  }, [pathname]);

  return null;
}
