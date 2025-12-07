'use client'

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuthStore } from "@/stores/useAuthStore"



export default function TermsPage() {
    const router = useRouter()
    const { user } = useAuthStore()

    useEffect(() => {
        if (!user) {
            router.push('/terms')
        }
    }, [user, router])

    if (!user) {
        return null
    }

    return (
        <div>
            <h1>Terminos y Condiciones</h1>
        </div>
    )
}