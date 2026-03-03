import { FormProvider as RHFForm } from "react-hook-form"

// ----------------------------------------------------------------------

interface FormProps {
  children: React.ReactNode
  onSubmit: React.FormEventHandler<HTMLFormElement>
  methods: any
}

// ----------------------------------------------------------------------

export function Form({ children, onSubmit, methods }: FormProps) {
  return (
    <RHFForm {...methods}>
      <form onSubmit={onSubmit} noValidate autoComplete="off">
        {children}
      </form>
    </RHFForm>
  )
}
