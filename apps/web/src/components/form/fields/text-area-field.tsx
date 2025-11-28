import { useFieldContext } from '../context';
import { FieldError } from '../field-error';
import { FieldSet } from '../field-set';
import { Textarea } from 'src/components/ui/textarea';

type TextAreaFieldProps = React.ComponentProps<typeof Textarea> & {
  label: string;
};

export function TextAreaField(props: TextAreaFieldProps) {
  const field = useFieldContext<string>();

  return (
    <FieldSet label={props.label}>
      <Textarea
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
