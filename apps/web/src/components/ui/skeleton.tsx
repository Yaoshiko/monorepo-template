import { cn } from 'src/lib/utils';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'animate-pulse rounded-md bg-slate-900/10 dark:bg-slate-50/10',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
