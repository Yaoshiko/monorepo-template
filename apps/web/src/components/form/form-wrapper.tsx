import { cn } from 'src/lib/utils';

type FormWrapperProps = React.PropsWithChildren &
  React.HtmlHTMLAttributes<HTMLFormElement> & {
    label: string;
    description?: string;
    className?: string;
  };

export function FormWrapper({
  label,
  description,
  className,
  children,
  onSubmit,
  ...props
}: FormWrapperProps) {
  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onSubmit?.(e);
  };

  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      onSubmit={handleOnSubmit}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">{label}</h1>
        {description && (
          <p className="text-muted-foreground text-sm text-balance">
            {description}
          </p>
        )}
      </div>
      {children}
    </form>
  );
}
