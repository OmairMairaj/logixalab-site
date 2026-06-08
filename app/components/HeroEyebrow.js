/**
 * Hero eyebrow — lime dot + uppercase tracked label. Carries `data-hero` so the
 * hero's blur-rise entrance ([useHeroEntrance]) animates it. Shared by the
 * /work, /services, /contact heroes.
 */
export default function HeroEyebrow({ label, className = "" }) {
  return (
    <p
      data-hero
      className={`mb-5 flex items-center gap-2 font-sans text-[0.7rem] font-medium uppercase tracking-[0.34em] text-white/45 will-change-[opacity,transform,filter] ${className}`}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-(--hero-accent)" aria-hidden />
      {label}
    </p>
  );
}
