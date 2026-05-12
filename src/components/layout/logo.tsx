import { cn } from '@/lib/utils';

/**
 * Hexagonal honeycomb mark + serif wordmark.
 * The hex glyph is hand-drawn in SVG so it stays crisp at any size and
 * inherits `currentColor` from the parent — letting us swap colors per theme.
 */
export function Logo({ className, withWord = true }: { className?: string; withWord?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <svg
        viewBox="0 0 28 30"
        aria-hidden
        className="size-7 -mt-0.5 text-[color:var(--color-brand)]"
      >
        <path
          d="M14 1.5 26.4 8.25v13.5L14 28.5 1.6 21.75V8.25z"
          fill="currentColor"
          fillOpacity="0.15"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path
          d="M14 7.5 21.5 11.7v8.4L14 24.3 6.5 20.1v-8.4z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.7"
        />
        <circle cx="14" cy="15.5" r="1.5" fill="currentColor" />
      </svg>
      {withWord ? (
        <span className="font-display text-[1.35rem] leading-none tracking-tight text-foreground">
          Book<span className="text-[color:var(--color-brand)]">·</span>Hive
        </span>
      ) : null}
    </span>
  );
}
