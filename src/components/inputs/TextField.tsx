import { Field, FieldError, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'

interface TextFieldProps extends React.ComponentProps<typeof Input> {
  label: string
  errorMessage?: string
}

export function TextField({ label, errorMessage, ...props }: TextFieldProps) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Input {...props} />
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </Field>
  )
}
