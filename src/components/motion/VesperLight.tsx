import { cn } from "@/lib/utils";

interface VesperLightProps {
  /** Visual intensity. "soft" is suitable for hero backgrounds over photography;
   * "rich" is for solid-color CTA sections. */
  intensity?: "soft" | "rich";
  className?: string;
}

/**
 * Slow drifting radial wash in indigo + brass.
 * Evokes candlelight through stained glass — the signature ambient motion
 * primitive of the Vesper system. Decorative only (`aria-hidden`), animation
 * suppressed under `prefers-reduced-motion` by the global CSS rule.
 */
export function VesperLight({ intensity = "soft", className }: VesperLightProps) {
  const indigoAlpha = intensity === "rich" ? 0.32 : 0.18;
  const brassAlpha = intensity === "rich" ? 0.22 : 0.12;
  const wineAlpha = intensity === "rich" ? 0.10 : 0.05;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      <div
        className="absolute inset-[-20%] animate-vesper-drift will-change-transform"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 22% 30%, rgba(59, 58, 143, ${indigoAlpha}) 0%, transparent 60%),
            radial-gradient(ellipse 50% 45% at 78% 70%, rgba(200, 162, 74, ${brassAlpha}) 0%, transparent 60%),
            radial-gradient(ellipse 45% 40% at 50% 55%, rgba(110, 42, 62, ${wineAlpha}) 0%, transparent 70%)
          `,
        }}
      />
    </div>
  );
}
