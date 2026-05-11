"use client";

import { useEffect, useRef } from "react";

interface MagneticOptions {
  /** Pull strength as a fraction of the cursor-to-center distance. 0.25 = subtle, 0.5 = obvious. */
  strength?: number;
  /** Activation radius in pixels around the element's center. */
  radius?: number;
}

/**
 * Subtle cursor magnetism for CTAs. The element translates toward the pointer
 * when within `radius`, then springs back on leave. Suppressed under
 * `prefers-reduced-motion: reduce` (no transform applied at all).
 */
export function useMagneticHover<T extends HTMLElement>({
  strength = 0.28,
  radius = 110,
}: MagneticOptions = {}) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    let raf = 0;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);

      if (dist > radius) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.style.transform = "";
        });
        return;
      }

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${dx * strength}px, ${dy * strength}px, 0)`;
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = "";
      });
    };

    el.style.transition = "transform 320ms cubic-bezier(0.22, 1, 0.36, 1)";
    el.style.willChange = "transform";

    window.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.style.transform = "";
      el.style.transition = "";
      el.style.willChange = "";
    };
  }, [strength, radius]);

  return ref;
}
