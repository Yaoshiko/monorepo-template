import { Input } from 'src/components/ui/input';
import { useFieldContext } from '../context';
import { FieldError } from '../field-error';
import { FieldSet } from '../field-set';

type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function TextField(props: TextFieldProps) {
  const field = useFieldContext<string>();

  return (
    <FieldSet label={props.label}>
      <Input
        id={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        {...props}
      />
      <FieldError
        isDirty={field.state.meta.isDirty}
        isBlurred={field.state.meta.isBlurred}
        error={field.state.meta.errors.map((e) => e?.message).find((e) => !!e)}
      />
    </FieldSet>
  );
}
