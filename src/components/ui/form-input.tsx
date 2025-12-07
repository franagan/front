'use client'

import * as React from "react"
import { useFormContext, Controller } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'> {
    name: string
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
    ({ name, className, ...props }, ref) => {
        const { control, formState } = useFormContext()
        const error = formState.errors[name]

        return (
            <Controller
                name={name}
                control={control}
                render={({ field }) => {
                    const fieldProps = {
                        ...field,
                        ...props,
                        ref: ref,
                        className: cn(
                            error && "border-red-500 focus-visible:ring-red-500",
                            className
                        )
                    }

                    // Para campos numéricos, convertir el valor
                    if (props.type === 'number') {
                        fieldProps.value = field.value === undefined ? '' : field.value
                        fieldProps.onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                            const value = e.target.value
                            field.onChange(value === '' ? undefined : Number(value))
                        }
                    }

                    // Para checkboxes
                    if (props.type === 'checkbox') {
                        fieldProps.checked = Boolean(field.value)
                        fieldProps.onChange = (e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.checked)
                    }

                    return <Input {...fieldProps} />
                }}
            />
        )
    }
)
FormInput.displayName = "FormInput"

export { FormInput }