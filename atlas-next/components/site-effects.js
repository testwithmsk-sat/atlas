"use client";

import { useEffect } from "react";

function markVisibleEntries(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
    }
  });
}

export function SiteEffects() {
  useEffect(() => {
    const root = document.documentElement;

    const setPointerPosition = (x, y) => {
      root.style.setProperty("--cursor-x", `${x}px`);
      root.style.setProperty("--cursor-y", `${y}px`);
      root.style.setProperty("--pointer-x", `${((x / window.innerWidth) * 2 - 1).toFixed(4)}`);
      root.style.setProperty("--pointer-y", `${((y / window.innerHeight) * 2 - 1).toFixed(4)}`);
    };

    const setScrollProgress = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      root.style.setProperty("--scroll-progress", `${Math.min(1, window.scrollY / maxScroll).toFixed(4)}`);
    };

    const handlePointerMove = (event) => {
      setPointerPosition(event.clientX, event.clientY);
    };

    setPointerPosition(window.innerWidth * 0.5, window.innerHeight * 0.35);
    setScrollProgress();

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("scroll", setScrollProgress, { passive: true });
    window.addEventListener("resize", setScrollProgress);

    const observer = new IntersectionObserver(markVisibleEntries, {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px"
    });

    const observeRevealNodes = () => {
      document.querySelectorAll("[data-reveal]").forEach((node) => {
        if (node.dataset.revealObserved === "true") return;
        node.dataset.revealObserved = "true";
        observer.observe(node);
      });
    };

    observeRevealNodes();

    const mutationObserver = new MutationObserver(observeRevealNodes);
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("scroll", setScrollProgress);
      window.removeEventListener("resize", setScrollProgress);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return <div className="site-cursor-glow" aria-hidden="true" />;
}
