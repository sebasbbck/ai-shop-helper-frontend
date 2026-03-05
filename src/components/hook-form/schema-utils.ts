import dayjs from 'dayjs'
import * as z from 'zod'
import { t } from 'i18next'

// ----------------------------------------------------------------------

interface SchemaUtilsProps {
  error?: {
    required?: string
    invalid?: string
  }
  isValid?: (val: string) => boolean
}

export const schemaUtils = {
  /**
   * Phone number
   * Apply for phone number input.
   */
  phoneNumber: (props?: SchemaUtilsProps) =>
    z
      .string()
      .min(1, {
        error:
          props?.error?.required ??
          t('translation:forms.phone_number_required'),
      })
      .refine((val) => props?.isValid?.(val), {
        error:
          props?.error?.invalid ?? t('translation:forms.phone_number_invalid'),
      }),

  /**
   * Email
   * Apply for email input.
   */
  email: (props?: SchemaUtilsProps) =>
    z.email({
      error: ({ input, code }) =>
        input && code.startsWith('invalid')
          ? (props?.error?.invalid ?? t('translation:forms.email_invalid'))
          : (props?.error?.required ?? t('translation:forms.email_required')),
    }),

  /**
   * Date
   * Apply for date pickers.
   */
  date: (props?: SchemaUtilsProps) =>
    z.preprocess(
      (val) => (val === undefined ? null : val), // Process input value before validation
      z.union([z.string(), z.number(), z.date(), z.null()]).check((ctx) => {
        const value = ctx.value

        if (value === null || value === '') {
          ctx.issues.push({
            code: 'custom',
            message:
              props?.error?.required ?? t('translation:forms.date_required'),
            input: value,
          })
          return
        }

        if (!dayjs(value).isValid()) {
          ctx.issues.push({
            code: 'custom',
            message:
              props?.error?.invalid ?? t('translation:forms.date_invalid'),
            input: value,
          })
        }
      }),
    ),

  /**
   * Editor
   * Apply for editor
   */
  editor: (props: { error: any }) =>
    z.string().refine(
      (val) => {
        const cleanedValue = val.trim()
        return cleanedValue !== '' && cleanedValue !== '<p></p>'
      },
      { error: props?.error ?? t('translation:forms.content_required') },
    ),

  /**
   * Nullable Input
   * Apply for input, select... with null value.
   */
  nullableInput: (schema: any, options: { error: any }) =>
    schema
      .nullable()
      .refine((val: null | undefined) => val !== null && val !== undefined, {
        error: options?.error ?? t('translation:forms.required'),
      }),

  /**
   * Boolean
   * Apply for checkbox, switch...
   */
  boolean: (props: { error: any }) =>
    z.boolean().refine((val) => val === true, {
      error: props?.error ?? t('translation:forms.required'),
    }),

  /**
   * Slider range
   * Apply for slider with range [min, max].
   */
  sliderRange: (props: { min: number; max: number; error: any }) =>
    z
      .number()
      .array()
      .refine((val) => val[0] >= props.min && val[1] <= props.max, {
        error:
          props.error ??
          t('translation:forms.range', { min: props.min, max: props.max }),
      }),

  /**
   * File
   * Apply for upload single file.
   */
  file: (props: { error: any }) =>
    z
      .file()
      .or(z.string())
      .or(z.null())
      .check((ctx) => {
        const value = ctx.value
        if (!value || (typeof value === 'string' && !value.length)) {
          ctx.issues.push({
            code: 'custom',
            message: props?.error ?? t('translation:forms.file_required'),
            input: value,
          })
        }
      }),
  /**
   * Files
   * Apply for upload multiple files.
   */
  files: (props: { error: any }) =>
    z
      .array(z.union([z.string(), z.file()]))
      .min(1, { error: props?.error ?? t('translation:forms.files_required') }),
}

// ----------------------------------------------------------------------

/**
 * Test one or multiple values against a Zod schema.
 */
export function testCase(schema: any, values: any[]) {
  const color = {
    green: (txt: string) => `\x1b[32m${txt}\x1b[0m`,
    red: (txt: string) => `\x1b[31m${txt}\x1b[0m`,
    gray: (txt: string) => `\x1b[90m${txt}\x1b[0m`,
  }

  values.forEach((value) => {
    const { data, success, error } = schema.safeParse(value)
    const type = color.gray(`(${typeof value})`)
    const serializedValue = JSON.stringify(value)

    const label = success
      ? color.green(`✅ Valid - ${serializedValue}`)
      : color.red(`❌ Error - ${serializedValue}`)
    const payload = success ? data : z.treeifyError(error)

    console.info(`${label} ${type}:`, JSON.stringify(payload, null, 2))
  })
}

// Example usage:
// testCase(schemaUtils.boolean(), [true, false, 'true', 'false', '', 1, 0, null, undefined]);

// testCase(schemaUtils.date(), [
//   '2025-04-10',
//   1712736000000,
//   new Date(),
//   '2025-02-30',
//   '04/10/2025',
//   'not-a-date',
//   '',
//   null,
//   undefined,
// ]);

// testCase(
//   schemaUtils.nullableInput(
//     z.coerce
//       .number()
//       .int()
//       .min(1, { error: 'Age is required!' })
//       .min(18, { error: 'Age must be between 18 and 80' })
//       .max(80, { error: 'Age must be between 18 and 80' }),
//     { error: 'Age is required!' }
//   ),
//   [2, '2', 18, '18', 79, '79', 81, '81', null, undefined]
// );
