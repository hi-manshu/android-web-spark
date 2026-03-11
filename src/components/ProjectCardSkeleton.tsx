
import { Skeleton } from '@/components/ui/skeleton';

export function ProjectCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col gap-3 animate-pulse">
      <Skeleton className="h-4 w-3/4 rounded-lg bg-foreground/[0.06]" />
      <Skeleton className="h-3 w-full rounded-lg bg-foreground/[0.04]" />
      <Skeleton className="h-3 w-2/3 rounded-lg bg-foreground/[0.04]" />
      <div className="flex gap-1.5 mt-1">
        <Skeleton className="h-5 w-14 rounded-full bg-foreground/[0.05]" />
        <Skeleton className="h-5 w-16 rounded-full bg-foreground/[0.05]" />
        <Skeleton className="h-5 w-12 rounded-full bg-foreground/[0.05]" />
      </div>
      <div className="flex items-center justify-between pt-2 mt-1 border-t border-foreground/[0.05]">
        <Skeleton className="h-3 w-20 rounded-lg bg-foreground/[0.04]" />
        <Skeleton className="h-6 w-10 rounded-lg bg-foreground/[0.04]" />
      </div>
    </div>
  );
}
