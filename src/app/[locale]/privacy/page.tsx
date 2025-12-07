'use client'

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuthStore } from "@/stores/useAuthStore"



export default function PrivacyPage() {
    const router = useRouter()
    const { user } = useAuthStore()

    useEffect(() => {
        if (!user) {
            router.push('/privacy')
        }
    }, [user, router])

    if (!user) {
        return null
    }

    return (
        <div>
            <h1>Política de Privacidad</h1>
        </div>
    )
}