'use client'

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/useAuthStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TrendingUp, Loader2 } from "lucide-react"

export default function RegisterPage() {
    const router = useRouter()
    const { register, isLoading, error } = useAuthStore()
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
    })
    const [validationError, setValidationError] = useState<string | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
        if (validationError) setValidationError(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.acceptTerms) {
            setValidationError('Debes aceptar los términos y condiciones')
            return
        }

        if (formData.password !== formData.confirmPassword) {
            setValidationError('Las contraseñas no coinciden')
            return
        }

        if (formData.password.length < 8) {
            setValidationError('La contraseña debe tener al menos 8 caracteres')
            return
        }

        try {
            await register(formData)
            router.push('/mainboard')
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="h-12 w-12 bg-black border-2 border-yellow-500 rounded-full flex items-center justify-center">
                            <TrendingUp className="h-6 w-6 text-yellow-500" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Crear Cuenta</CardTitle>
                    <CardDescription>
                        Únete a Inversión Libre y comienza tu camino FIRE
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {(error || validationError) && (
                            <Alert variant="destructive">
                                <AlertDescription>{validationError || error}</AlertDescription>
                            </Alert>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="firstName">Nombre</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                type="text"
                                placeholder="Juan"
                                required
                                value={formData.firstName}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Apellidos</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                type="text"
                                placeholder="Pérez García"
                                required
                                value={formData.lastName}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="tu@email.com"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña (mínimo 8 caracteres)</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="flex items-start space-x-2">
                            <input
                                id="acceptTerms"
                                name="acceptTerms"
                                type="checkbox"
                                checked={formData.acceptTerms}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="mt-1 h-4 w-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                            />
                            <Label htmlFor="acceptTerms" className="text-sm font-normal cursor-pointer">
                                Acepto los{' '}
                                <a href="/terms" target="_blank" className="text-yellow-600 hover:text-yellow-700 underline">
                                    términos y condiciones
                                </a>
                                {' '}y la{' '}
                                <a href="/privacy" target="_blank" className="text-yellow-600 hover:text-yellow-700 underline">
                                    política de privacidad
                                </a>
                            </Label>
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creando cuenta...
                                </>
                            ) : (
                                'Registrarse'
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 text-center text-sm text-gray-500">
                    <p>
                        ¿Ya tienes una cuenta?{' '}
                        <Link href="/auth/login" className="text-yellow-600 hover:text-yellow-700 font-medium">
                            Inicia Sesión
                        </Link>
                    </p>
                    <Link href="/" className="text-gray-500 hover:text-gray-700">
                        Volver al inicio
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
