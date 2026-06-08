/**
 * "Scroll to explore" cue — label + a vertical pulsing line. Carries `data-hero`
 * so the hero's blur-rise entrance ([useHeroEntrance]) animates it. Pass
 * positioning via `className` (e.g. "self-start md:self-auto" in a flex row).
 */
export default function ScrollCue({ className = "" }) {
  return (
    <p
      data-hero
      className={`flex items-center gap-2 font-sans text-[0.7rem] font-medium uppercase tracking-[0.28em] text-white/40 will-change-[opacity,transform,filter] ${className}`}
    >
      Scroll to explore
      <span className="inline-block h-4 w-px animate-pulse bg-(--hero-accent)/70" aria-hidden />
    </p>
  );
}
