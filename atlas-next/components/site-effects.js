"use client";

import { useEffect } from "react";

function markVisibleEntries(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
    }
  });
}

function attachTiltHandlers(node) {
  if (!node || node.dataset.tiltBound === "true") return () => {};
  node.dataset.tiltBound = "true";

  const handleMove = (event) => {
    const bounds = node.getBoundingClientRect();
    const relativeX = (event.clientX - bounds.left) / Math.max(bounds.width, 1);
    const relativeY = (event.clientY - bounds.top) / Math.max(bounds.height, 1);
    const rotateY = (relativeX - 0.5) * 18;
    const rotateX = (0.5 - relativeY) * 16;

    node.style.setProperty("--tilt-rotate-x", `${rotateX.toFixed(2)}deg`);
    node.style.setProperty("--tilt-rotate-y", `${rotateY.toFixed(2)}deg`);
    node.style.setProperty("--tilt-glow-x", `${(relativeX * 100).toFixed(2)}%`);
    node.style.setProperty("--tilt-glow-y", `${(relativeY * 100).toFixed(2)}%`);
  };

  const handleLeave = () => {
    node.style.setProperty("--tilt-rotate-x", "0deg");
    node.style.setProperty("--tilt-rotate-y", "0deg");
    node.style.setProperty("--tilt-glow-x", "50%");
    node.style.setProperty("--tilt-glow-y", "50%");
  };

  node.addEventListener("pointermove", handleMove);
  node.addEventListener("pointerleave", handleLeave);
  handleLeave();

  return () => {
    node.removeEventListener("pointermove", handleMove);
    node.removeEventListener("pointerleave", handleLeave);
  };
}

export function SiteEffects() {
  useEffect(() => {
    const root = document.documentElement;
    const tiltCleanups = new Map();

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

      document.querySelectorAll("[data-tilt]").forEach((node) => {
        if (tiltCleanups.has(node)) return;
        tiltCleanups.set(node, attachTiltHandlers(node));
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
      tiltCleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <>
      <div className="site-background-system" aria-hidden="true">
        <span className="site-backdrop-orb site-backdrop-orb--violet"></span>
        <span className="site-backdrop-orb site-backdrop-orb--pink"></span>
        <span className="site-backdrop-orb site-backdrop-orb--blue"></span>
        <span className="site-backdrop-streak site-backdrop-streak--one"></span>
        <span className="site-backdrop-streak site-backdrop-streak--two"></span>
      </div>
      <div className="site-cursor-glow" aria-hidden="true" />
    </>
  );
}
