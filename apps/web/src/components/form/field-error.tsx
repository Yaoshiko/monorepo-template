import { cn } from 'src/lib/utils';
import { Label } from '@radix-ui/react-label';

type FieldErrorProps = {
  isDirty: boolean;
  isBlurred: boolean;
  error?: string;
  className?: string;
};

export function FieldError({
  isDirty,
  isBlurred,
  error,
  className
}: FieldErrorProps) {
  return (
    isDirty &&
    isBlurred &&
    !!error && (
      <Label className={cn('text-destructive italic', className)}>
        {error}
      </Label>
    )
  );
}
