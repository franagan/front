'use client'

import { useState, useEffect } from "react"
import { useRouter } from "@/i18n/navigation"
import { useAuthStore } from "../../stores/useAuthStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Modal } from "@/components/ui/modal"
import { TrendingUp, Loader2 } from "lucide-react"
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import GoogleLoginButton from "./GoogleLoginButton";

interface AuthModalProps {
    isOpen: boolean
    onClose: () => void
    defaultTab?: 'login' | 'register'
}

export default function AuthModal({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) {
    const t = useTranslations('auth');
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab)
    const { login, register, isLoading, error, clearError, isAuthenticated } = useAuthStore()

    useEffect(() => {
        if (isAuthenticated && isOpen) {
            onClose();
            router.push('/mainboard');
        }
    }, [isAuthenticated, isOpen, onClose, router]);

    // Login Form State
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    })

    // Register Form State
    const [registerData, setRegisterData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
    })
    const [validationError, setValidationError] = useState<string | null>(null)

    // Reset state when opening/closing or switching tabs
    const handleTabChange = (tab: 'login' | 'register') => {
        setActiveTab(tab)
        clearError()
        setValidationError(null)
    }

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setLoginData(prev => ({ ...prev, [name]: value }))
    }

    const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        setRegisterData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
        if (validationError) setValidationError(null)
    }

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await login(loginData)
            onClose()
            router.push('/mainboard')
        } catch {
            // Error handled by store
        }
    }

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!registerData.acceptTerms) {
            setValidationError('Debes aceptar los términos y condiciones') // TODO: Translate validation errors
            return
        }

        if (registerData.password !== registerData.confirmPassword) {
            setValidationError(t('register.errors.passwordsNotMatch'))
            return
        }

        if (registerData.password.length < 8) {
            setValidationError(t('register.errors.passwordMin'))
            return
        }

        try {
            await register({
                firstName: registerData.firstName,
                lastName: registerData.lastName,
                email: registerData.email,
                password: registerData.password,
                confirmPassword: registerData.confirmPassword,
                acceptTerms: registerData.acceptTerms
            })
            onClose()
            router.push('/mainboard')
        } catch {
            // Error handled by store
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={activeTab === 'login' ? t('login.title') : t('register.title')}
            size="sm"
        >
            <div className="flex flex-col space-y-6">
                <div className="flex justify-center">
                    <div className="h-12 w-12 bg-black border-2 border-yellow-500 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-yellow-500" />
                    </div>
                </div>

                {(error || validationError) && (
                    <Alert variant="destructive">
                        <AlertDescription>{validationError || error}</AlertDescription>
                    </Alert>
                )}

                {activeTab === 'login' ? (
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                        <GoogleLoginButton />
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    {t('login.or')}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="login-email">{t('login.email')}</Label>
                            <Input
                                id="login-email"
                                name="email"
                                type="email"
                                placeholder="tu@email.com"
                                required
                                value={loginData.email}
                                onChange={handleLoginChange}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="login-password">{t('login.password')}</Label>
                            <Input
                                id="login-password"
                                name="password"
                                type="password"
                                required
                                value={loginData.password}
                                onChange={handleLoginChange}
                                disabled={isLoading}
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t('common.loading')}
                                </>
                            ) : (
                                t('login.submit')
                            )}
                        </Button>
                        <div className="text-center text-sm text-gray-500">
                            {t('login.noAccount')}{' '}
                            <button
                                type="button"
                                onClick={() => handleTabChange('register')}
                                className="text-yellow-600 hover:text-yellow-700 font-medium hover:underline"
                            >
                                {t('login.signUp')}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleRegisterSubmit} className="space-y-4">
                        <GoogleLoginButton />
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    {t('login.or')}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="register-firstName">{t('register.firstName')}</Label>
                            <Input
                                id="register-firstName"
                                name="firstName"
                                type="text"
                                placeholder="Juan"
                                required
                                value={registerData.firstName}
                                onChange={handleRegisterChange}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="register-lastName">{t('register.lastName')}</Label>
                            <Input
                                id="register-lastName"
                                name="lastName"
                                type="text"
                                placeholder="Pérez García"
                                required
                                value={registerData.lastName}
                                onChange={handleRegisterChange}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="register-email">{t('register.email')}</Label>
                            <Input
                                id="register-email"
                                name="email"
                                type="email"
                                placeholder="tu@email.com"
                                required
                                value={registerData.email}
                                onChange={handleRegisterChange}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="register-password">{t('register.password')}</Label>
                            <Input
                                id="register-password"
                                name="password"
                                type="password"
                                required
                                value={registerData.password}
                                onChange={handleRegisterChange}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="register-confirm">{t('register.confirmPassword')}</Label>
                            <Input
                                id="register-confirm"
                                name="confirmPassword"
                                type="password"
                                required
                                value={registerData.confirmPassword}
                                onChange={handleRegisterChange}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="flex items-start space-x-2">
                            <input
                                id="register-terms"
                                name="acceptTerms"
                                type="checkbox"
                                checked={registerData.acceptTerms}
                                onChange={handleRegisterChange}
                                disabled={isLoading}
                                className="mt-1 h-4 w-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                            />
                            <Label htmlFor="register-terms" className="text-sm font-normal cursor-pointer">
                                Acepto los{' '}
                                <Link href="/terms" target="_blank" className="text-yellow-600 hover:text-yellow-700 underline">
                                    términos y condiciones
                                </Link>
                                {' '}y la{' '}
                                <Link href="/privacy" target="_blank" className="text-yellow-600 hover:text-yellow-700 underline">
                                    política de privacidad
                                </Link>
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
                                    {t('common.loading')}
                                </>
                            ) : (
                                t('register.submit')
                            )}
                        </Button>
                        <div className="text-center text-sm text-gray-500">
                            {t('register.hasAccount')}{' '}
                            <button
                                type="button"
                                onClick={() => handleTabChange('login')}
                                className="text-yellow-600 hover:text-yellow-700 font-medium hover:underline"
                            >
                                {t('register.signIn')}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </Modal>
    )
}
