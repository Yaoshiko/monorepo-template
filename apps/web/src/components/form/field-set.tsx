import { cn } from 'src/lib/utils';
import { Label } from '@radix-ui/react-label';

type FieldSetProps = React.PropsWithChildren & {
  label: string;
  className?: string;
};

export function FieldSet({ label, className, children }: FieldSetProps) {
  return (
    <div className={cn('grid gap-2', className)}>
      <Label htmlFor="email">{label}</Label>
      {children}
    </div>
  );
}
