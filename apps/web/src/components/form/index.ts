import { createFormHook } from '@tanstack/react-form';
import { fieldContext, formContext } from './context';
import { TextField } from './fields/text-field';
import { SubmitButton } from './submit-button';
import { FormWrapper } from './form-wrapper';
import { TextAreaField } from './fields/text-area-field';

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    TextField,
    TextAreaField
  },
  formComponents: {
    FormWrapper,
    SubmitButton
  },
  fieldContext,
  formContext
});
