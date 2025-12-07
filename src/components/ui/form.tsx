'use client'

import * as React from "react"
import { useForm, FormProvider, useFormContext, ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

// Types para mejor TypeScript
export type FormSchema = z.ZodType<any, any>

interface FormProps<T extends FieldValues> {
    schema: FormSchema
    onSubmit: (data: T) => void | Promise<void>
    defaultValues?: Partial<T>
    children: React.ReactNode
    className?: string
    mode?: "onChange" | "onBlur" | "onSubmit" | "onTouched" | "all"
}

// Componente Form principal
function Form<T extends FieldValues>({
    schema,
    onSubmit,
    defaultValues,
    children,
    className,
    mode = "onBlur"
}: FormProps<T>) {
    const form = useForm<T>({
        resolver: zodResolver(schema),
        defaultValues: defaultValues as any,
        mode
    })

    const handleSubmit = form.handleSubmit(async (data: T) => {
        try {
            await onSubmit(data)
        } catch (error) {
            console.error("Form submission error:", error)
        }
    })

    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
                {children}
            </form>
        </FormProvider>
    )
}

// Context para acceso al form
interface FormFieldContextValue<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
    name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
    {} as FormFieldContextValue
)

interface FormFieldProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
    name: TName
    children: React.ReactNode
}

// FormField para wrappear inputs
const FormField = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    name,
    children
}: FormFieldProps<TFieldValues, TName>) => {
    return (
        <FormFieldContext.Provider value={{ name }}>
            {children}
        </FormFieldContext.Provider>
    )
}

// FormItem para estructura
const FormItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    return (
        <div ref={ref} className={cn("space-y-2", className)} {...props} />
    )
})
FormItem.displayName = "FormItem"

// FormLabel con manejo de errores
const FormLabel = React.forwardRef<
    React.ElementRef<typeof Label>,
    React.ComponentPropsWithoutRef<typeof Label> & {
        required?: boolean
    }
>(({ className, required, children, ...props }, ref) => {
    const { name } = React.useContext(FormFieldContext)
    const { formState } = useFormContext()
    const error = formState.errors[name]

    return (
        <Label
            ref={ref}
            className={cn(
                error && "text-red-600",
                className
            )}
            htmlFor={name}
            {...props}
        >
            {children}
            {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
    )
})
FormLabel.displayName = "FormLabel"

// FormControl para wrappear inputs
const FormControl = React.forwardRef<
    HTMLElement,
    React.HTMLAttributes<HTMLElement>
>(({ ...props }, ref) => {
    const { name } = React.useContext(FormFieldContext)
    const { formState } = useFormContext()
    const error = formState.errors[name]

    return (
        <div
            ref={ref as React.RefObject<HTMLDivElement>}
            className={cn(error && "has-error")}
            {...props}
        />
    )
})
FormControl.displayName = "FormControl"

// FormDescription para ayuda
const FormDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
    return (
        <p
            ref={ref}
            className={cn("text-sm text-gray-600", className)}
            {...props}
        />
    )
})
FormDescription.displayName = "FormDescription"

// FormMessage para errores
const FormMessage = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
    const { name } = React.useContext(FormFieldContext)
    const { formState } = useFormContext()
    const error = formState.errors[name]
    const body = error ? String(error?.message) : children

    if (!body) {
        return null
    }

    return (
        <p
            ref={ref}
            className={cn(
                "text-sm font-medium",
                error ? "text-red-600" : "text-gray-600",
                className
            )}
            {...props}
        >
            {body}
        </p>
    )
})
FormMessage.displayName = "FormMessage"

// Hook personalizado para usar el form
export const useFormField = () => {
    const fieldContext = React.useContext(FormFieldContext)
    const { formState, getFieldState } = useFormContext()

    if (!fieldContext) {
        throw new Error("useFormField should be used within <FormField>")
    }

    const fieldState = getFieldState(fieldContext.name, formState)

    return {
        name: fieldContext.name,
        formState,
        fieldState,
        error: fieldState.error
    }
}

// Schemas de validación comunes para finanzas
export const financialSchemas = {
    // Login
    login: z.object({
        email: z
            .string()
            .email("Email inválido")
            .min(1, "Email es obligatorio"),
        password: z
            .string()
            .min(6, "La contraseña debe tener al menos 6 caracteres")
            .min(1, "Contraseña es obligatoria"),
        rememberMe: z.boolean().optional()
    }),

    // Registro
    register: z.object({
        name: z
            .string()
            .min(2, "El nombre debe tener al menos 2 caracteres")
            .min(1, "Nombre es obligatorio"),
        email: z
            .string()
            .email("Email inválido")
            .min(1, "Email es obligatorio"),
        password: z
            .string()
            .min(8, "La contraseña debe tener al menos 8 caracteres")
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Debe contener al menos: 1 mayúscula, 1 minúscula y 1 número"),
        confirmPassword: z.string(),
        acceptTerms: z
            .boolean()
            .refine(val => val === true, "Debes aceptar los términos y condiciones")
    }).refine(data => data.password === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"]
    }),

    // Añadir inversión
    investment: z.object({
        symbol: z
            .string()
            .min(1, "Símbolo es obligatorio")
            .regex(/^[A-Z]{1,5}$/, "Símbolo debe ser 1-5 letras mayúsculas"),
        name: z
            .string()
            .min(1, "Nombre de la empresa es obligatorio"),
        quantity: z
            .number()
            .positive("La cantidad debe ser positiva")
            .min(0.01, "Cantidad mínima es 0.01"),
        price: z
            .number()
            .positive("El precio debe ser positivo")
            .min(0.01, "Precio mínimo es 0.01"),
        currency: z
            .string()
            .min(1, "Moneda es obligatoria"),
        broker: z
            .string()
            .min(1, "Broker es obligatorio"),
        type: z
            .enum(["stock", "etf", "bond", "reit", "crypto", "commodity"]),
        purchaseDate: z
            .date()
            .max(new Date(), "La fecha no puede ser futura")
    }),

    // Calculadora interés compuesto
    compoundCalculator: z.object({
        initialAmount: z
            .number()
            .min(0, "Capital inicial no puede ser negativo")
            .max(10000000, "Capital inicial máximo es 10M€"),
        monthlyContribution: z
            .number()
            .min(0, "Aportación mensual no puede ser negativa")
            .max(100000, "Aportación mensual máxima es 100K€"),
        annualReturn: z
            .number()
            .min(-50, "Rentabilidad mínima es -50%")
            .max(100, "Rentabilidad máxima es 100%"),
        years: z
            .number()
            .int("Años debe ser un número entero")
            .min(1, "Mínimo 1 año")
            .max(50, "Máximo 50 años"),
        compoundFrequency: z
            .enum(["monthly", "quarterly", "yearly"])
    }),

    // Perfil de usuario
    userProfile: z.object({
        name: z
            .string()
            .min(2, "El nombre debe tener al menos 2 caracteres"),
        email: z
            .string()
            .email("Email inválido"),
        phone: z
            .string()
            .regex(/^(\+34|0034|34)?[6|7|8|9][0-9]{8}$/, "Teléfono español inválido")
            .optional(),
        birthDate: z
            .date()
            .max(new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000), "Debes ser mayor de 18 años"),
        riskProfile: z
            .enum(["conservative", "moderate", "aggressive"]),
        investmentGoals: z
            .array(z.string())
            .min(1, "Selecciona al menos un objetivo"),
        monthlyIncome: z
            .number()
            .positive("Los ingresos deben ser positivos")
            .max(1000000, "Ingresos máximos 1M€/mes"),
        investmentExperience: z
            .enum(["beginner", "intermediate", "advanced"])
    })
}

// Tipos TypeScript para los schemas
export type LoginFormData = z.infer<typeof financialSchemas.login>
export type RegisterFormData = z.infer<typeof financialSchemas.register>
export type InvestmentFormData = z.infer<typeof financialSchemas.investment>
export type CompoundCalculatorData = z.infer<typeof financialSchemas.compoundCalculator>
export type UserProfileData = z.infer<typeof financialSchemas.userProfile>

export {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    useForm,
    useFormContext
}