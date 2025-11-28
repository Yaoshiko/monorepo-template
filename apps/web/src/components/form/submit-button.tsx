import { cn } from 'src/lib/utils';
import { LoadingButton } from '../loading-button';
import { useFormContext } from './context';

type SubmitButtonProps = {
  label: string;
  className?: string;
};

export function SubmitButton({ label, className }: SubmitButtonProps) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <LoadingButton
          type="submit"
          className={cn('w-full', className)}
          loading={isSubmitting}
          disabled={!canSubmit}
        >
          {label}
        </LoadingButton>
      )}
    </form.Subscribe>
  );
}
