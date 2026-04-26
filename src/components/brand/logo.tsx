import { cn } from '@/lib/utils';

export function Logo({ className, withWordmark = true }: { className?: string; withWordmark?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span
        aria-hidden
        className="grid size-7 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-soft text-[12px] font-semibold text-text-primary"
      >
        S
      </span>
      {withWordmark ? (
        <span className="text-[15px] font-medium tracking-tight text-text-primary">
          SatoriAI Lab
        </span>
      ) : null}
    </span>
  );
}
