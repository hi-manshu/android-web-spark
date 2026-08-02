/* ─────────────────────────────────────────────────────────────────────────────
   Page header in the showcase design language: tracked-out eyebrow,
   large serif display title, muted description. Pages render this when
   the "showcase" feature switch is on and keep their classic header
   otherwise. Uses foreground tokens so it works on themed pages too.
───────────────────────────────────────────────────────────────────────────── */

export function ShowcaseHeader({
  eyebrow,
  title,
  description,
  center = false,
  className = 'mb-12',
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={`${className} ${center ? 'text-center' : ''}`}>
      {eyebrow && (
        <p className="text-foreground/35 text-xs uppercase tracking-[0.25em] mb-4">{eyebrow}</p>
      )}
      <h1 className="font-serif text-5xl sm:text-6xl font-bold tracking-tight text-foreground mb-4 leading-[1.05]">
        {title}
      </h1>
      {description && (
        <p className={`text-foreground/50 text-sm sm:text-base leading-relaxed max-w-lg ${center ? 'mx-auto' : ''}`}>
          {description}
        </p>
      )}
    </div>
  );
}
